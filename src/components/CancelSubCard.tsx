"use client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";
import { Button } from "./ui/button";
import { set, sub } from "date-fns";
import { useRouter } from "next/navigation";

type Props = { subscriptionId: string; userId: string };
const CancelSubCard = ({ subscriptionId, userId }: Props) => {
    const [hasSub, setHasSub] = React.useState(subscriptionId !== null);
    const [loading, setLoading] = React.useState(false);

    const router = useRouter();

    const cancelSub = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/cancel-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subscriptionId: subscriptionId,
                    userId: userId,
                }),
            });
            const data = await res.json();
            if (data.message === "deleted") {
                setHasSub(false);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
            alert(
                "Couldn't cancel. Please contact Bobby to delete. Don't worry, you'll be refunded for any month you didn't use."
            );
        }
    };

    if (hasSub) {
        return (
            <div>
                <Button
                    disabled={loading}
                    variant={"destructive"}
                    onClick={cancelSub}
                >
                    Cancel Subscription
                </Button>
            </div>
        );
    } else {
        return <div>You don't have a subscription</div>;
    }
};
export default CancelSubCard;
