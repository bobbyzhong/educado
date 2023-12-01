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
            className="font-medium text-[17px] md:text-[19px]"
            onClick={handleSubmit}
        >
            Are you a teacher who has access to Educado? Click{" "}
            <span className="text-green underline cursor-pointer">here</span> to
            join as a teacher
        </div>
    );
};
export default HomePageJoinCode;
