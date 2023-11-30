"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = { text: string; tutorId: string };

const SignInButtonStudent = ({ text, tutorId }: Props) => {
    const router = useRouter();

    return (
        <Button
            variant={"green"}
            size={"login"}
            onClick={() => {
                signIn("google", { callbackUrl: `/tutor/${tutorId}` }).catch(
                    console.error
                );
            }}
        >
            {text}
        </Button>
    );
};

export default SignInButtonStudent;
