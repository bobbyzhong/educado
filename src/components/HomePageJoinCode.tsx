"use client";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

type Props = {
    isSignedIn: any;
};
const HomePageJoinCode = ({ isSignedIn }: Props) => {
    const [code, setCode] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isSignedIn) {
            router.push(`/teacher-portal`);
        } else {
            signIn("google", { callbackUrl: `/teacher-portal` }).catch(
                console.error
            );
        }
        // You can perform any action with the inputText here, e.g., send it to an API, display it on the page, etc.
    };

    return (
        <div
            className="text-green underline cursor-pointer"
            onClick={handleSubmit}
        >
            here
        </div>
    );
};
export default HomePageJoinCode;
