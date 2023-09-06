"use client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";
import { Button } from "./ui/button";
import { set } from "date-fns";
import { useRouter } from "next/navigation";

type Props = { userId: string };
const PaymentForm = ({ userId }: Props) => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const router = useRouter();

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
            Name:{" "}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            Email:{" "}
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <CardElement /> <br />
            <Button
                variant={"green"}
                disabled={loading}
                onClick={createSubscription}
            >
                Subscribe
            </Button>
            <div>Refresh Page after</div>
        </div>
    );
};
export default PaymentForm;
