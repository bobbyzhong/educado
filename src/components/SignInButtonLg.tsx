"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

type Props = { text: string };

const SignInButtonLg = ({ text }: Props) => {
    return (
        <Button
            variant={"green"}
            className=""
            size={"xl"}
            onClick={() => {
                signIn("google").catch(console.error);
            }}
        >
            {text}
        </Button>
    );
};

export default SignInButtonLg;
