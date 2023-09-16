"use client";
import Link from "next/link";
import { QuizModalLink } from "./QuizModalLink";
import Image from "next/image";
import { X } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { Button } from "../ui/button";

export const QuizModal = ({
    isVisible,
    onClose,
    subscribed,
    userId,
}: {
    isVisible: any;
    onClose: any;
    subscribed: any;
    userId: any;
}) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    const handlePayment = async () => {
        try {
            const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
            const stripe = await loadStripe(STRIPE_PK);
            const priceId = "price_1NoxZODcb7DT3eZH6HkMAX85";
            const res = await fetch("/api/checkout/", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ priceId: priceId, userId: userId }),
            });
            const json = await res.json();
            if (!json.ok) {
                throw new Error("Something went wrong");
            }

            if (!stripe) {
                throw new Error("Something went wrong");
            }
            await stripe.redirectToCheckout({ sessionId: json.result.id });
        } catch (e) {
            console.log(e);
        }
    };

    if (subscribed) {
        return (
            <div
                className="z-[60] fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm
        flex justify-center items-center"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[550px] rounded-md flex flex-col bg-white1 py-10 px-7 mb-5">
                    <div className="flex flex-row justify-between mb-3">
                        <Image
                            src={"/icons/quizmodalicons.svg"}
                            height={120}
                            width={120}
                            alt="icongroup"
                        />
                        <X onClick={onClose} cursor={"pointer"} />
                    </div>
                    <div className="flex flex-col TEXT mb-4">
                        <h1 className="font-semibold text-lg tracking-tight mb-1">
                            Select Check-In Type
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Choose where the content of your quiz will be coming
                            from
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <QuizModalLink
                            link={"/new-check-in"}
                            title={"Topic Name"}
                            icon={"/icons/pageicon.svg"}
                        >
                            Create a check-in based off the topic name. Base it
                            off of state or school standards or just raw
                            content.
                        </QuizModalLink>
                        <QuizModalLink
                            link={"/new-textbook-check-in"}
                            title={"Textbook"}
                            icon={"/icons/textbookicon.svg"}
                        >
                            Create a check-in based off of a specific textbook.
                            Quiz key concepts or chapters of a textbook.
                        </QuizModalLink>
                        <QuizModalLink
                            link={"/new-custom-check-in"}
                            title={"Custom Content"}
                            icon={"/icons/custom-icon.svg"}
                        >
                            Create a check-in based off your uploaded custom
                            content. Slides, docs, websites, etc.
                        </QuizModalLink>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div
                className="z-[60] fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm
        flex justify-center items-center"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[575px] rounded-md flex flex-col bg-white1 py-10 px-7 mb-5">
                    <div className="flex flex-row justify-between mb-3">
                        <Image
                            src={"/icons/quizmodalicons.svg"}
                            height={120}
                            width={120}
                            alt="icongroup"
                        />
                        <X onClick={onClose} cursor={"pointer"} />
                    </div>
                    <div className="flex flex-col TEXT mb-4">
                        <h1 className="font-semibold text-lg tracking-tight mb-1">
                            Subscribe to make more check-ins!
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            You've used up your three free check-ins. It will
                            cost $5 a month to continue using Educado. This is
                            just to cover our costs of running Educado.
                        </p>
                        <p className="text-zinc-500 text-sm mt-3">
                            Please contact Bobby if you have any issues with
                            paying that amount at the moment and we can work
                            something out!
                        </p>
                    </div>

                    <Button onClick={handlePayment} variant={"green"}>
                        Subscribe
                    </Button>
                </div>
            </div>
        );
    }
};
