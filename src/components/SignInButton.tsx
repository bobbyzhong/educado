"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = { text: string };

const SignInButton = ({ text }: Props) => {
  const router = useRouter();

  return (
    <Button
      variant={"green"}
      size={"login"}
      onClick={() => {
        signIn("google", { callbackUrl: "/dashboard" }).catch(console.error);
      }}
    >
      {text}
    </Button>
  );
};

export default SignInButton;
