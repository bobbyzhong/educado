"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

type Props = { text: string };

const SignInButton = ({ text }: Props) => {
    return (
        <Button
            variant={"green"}
            size={"login"}
            onClick={() => {
                signIn("google", { callbackUrl: "/dashboard-student" }).catch(
                    console.error
                );
            }}
        >
            {text}
        </Button>
    );
};

export default SignInButton;
