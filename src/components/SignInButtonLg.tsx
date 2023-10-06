"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = { text: string; isSignedIn: any; link: string };

const SignInButtonLg = ({ text, isSignedIn, link }: Props) => {
    const router = useRouter();
    console.log(link);
    return (
        <Button
            variant={"green"}
            className=""
            size={"xl"}
            onClick={() => {
                if (isSignedIn) {
                    router.push(link);
                } else {
                    signIn("google", {
                        callbackUrl: link,
                    }).catch(console.error);
                }
            }}
        >
            {text}
        </Button>
    );
};

export default SignInButtonLg;
