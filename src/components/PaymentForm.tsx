"use client";
import {
    CardElement,
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import React from "react";
import { Button } from "./ui/button";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { loadStripe } from "@stripe/stripe-js";

type Props = { userId: string };
const PaymentForm = ({ userId }: Props) => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const router = useRouter();

    const paymentElementOptions: any = {
        appearance: {
            theme: "stripe",
        },
    };

    const createSubscription = async () => {
        try {
            setLoading(true);
            const paymentMethod = await stripe!.createPaymentMethod({
                type: "card",
                card: elements!.getElement(CardElement)!,
            });

            const res = await fetch("/api/create-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    payment_method: paymentMethod.paymentMethod!.id,
                    userId: userId,
                }),
            });

            if (!res.ok) return alert("Payment unsuccessful");
            const data = await res.json();
            const confirm = await stripe!.confirmCardPayment(data.clientSecret);
            if (confirm.error) {
                console.log(confirm.error);
                return alert("Payment failed");
            }
            setLoading(false);
            router.push("/");
        } catch (e) {
            console.log(e);
            alert("Payment failed ");
        }
    };

    return (
        <div>
            <h1 className="text-sm font-semibold text-zinc-500 tracking-wide mb-1">
                Name
            </h1>
            <Input
                placeholder="John Doe"
                value={name}
                type="text"
                min={1}
                max={10}
                onChange={(e) => setName(e.target.value)}
            />
            <h1 className="text-sm font-semibold text-zinc-500 tracking-wide mt-3 mb-1">
                Email
            </h1>
            <Input
                placeholder="example@gmail.com"
                type="text"
                min={1}
                max={10}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <CardElement options={paymentElementOptions} /> <br />
            <Button
                variant={"green"}
                disabled={loading}
                onClick={createSubscription}
            >
                Subscribe
            </Button>
            <div className="text-[13px] font-semibold text-zinc-500 mt-3">
                Note: You may need to refresh the page if you've already paid
                but it's not showing up
            </div>
        </div>
    );
};
export default PaymentForm;
