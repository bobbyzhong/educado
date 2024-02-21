"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = { callback: string; text: string; tutorId: string };

const SignInButtonStudent = ({ callback, text, tutorId }: Props) => {
    const router = useRouter();

    return (
        <Button
            variant={"green"}
            size={"login"}
            onClick={() => {
                signIn("google", { callbackUrl: callback }).catch(
                    console.error
                );
            }}
        >
            {text}
        </Button>
    );
};

export default SignInButtonStudent;
