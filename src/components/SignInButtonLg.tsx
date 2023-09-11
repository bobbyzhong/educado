"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = { text: string; isSignedIn: any };

const SignInButtonLg = ({ text, isSignedIn }: Props) => {
  const router = useRouter();

  return (
    <Button
      variant={"green"}
      className=""
      size={"xl"}
      onClick={() => {
        if (isSignedIn) {
          router.push("/dashboard");
        } else {
          signIn("google").catch(console.error);
        }
      }}
    >
      {text}
    </Button>
  );
};

export default SignInButtonLg;
