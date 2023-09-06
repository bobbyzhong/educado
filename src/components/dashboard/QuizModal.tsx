import Link from "next/link";
import { QuizModalLink } from "./QuizModalLink";
import Image from "next/image";
import { X } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../PaymentForm";
import { loadStripe } from "@stripe/stripe-js";

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

    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

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
                            title={"Plain Content"}
                            icon={"/icons/pageicon.svg"}
                        >
                            Create a check-in based off your own content. Copy
                            and paste the material yourself!
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
                            Need to Subscribe
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            It will cost $5 a month to continue using Pear. This
                            is just to cover our costs of running the service.
                        </p>
                    </div>
                    <Elements stripe={stripePromise}>
                        <PaymentForm userId={userId} />
                    </Elements>
                </div>
            </div>
        );
    }
};
