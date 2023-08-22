"use client";
import SignInButtonLg from "@/components/SignInButtonLg";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

type Props = {};
const LogIn = (props: Props) => {
    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Button
                variant={"green"}
                className=""
                size={"login"}
                onClick={() => {
                    signIn("google").catch(console.error);
                }}
            >
                <div className="flex flex-row justify-between items-center gap-3">
                    <Image
                        src={"/icons/google.png"}
                        height={25}
                        width={25}
                        alt=""
                    />{" "}
                    <h1 className="text-[15px] font-outfit">
                        Sign In with Google
                    </h1>
                </div>
            </Button>
        </div>
    );
};
export default LogIn;
