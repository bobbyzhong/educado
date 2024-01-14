"use client";
import SignInButtonLg from "@/components/SignInButtonLg";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type Props = {};
const Logout = (props: Props) => {
    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Button
                variant={"green"}
                className=""
                size={"login"}
                onClick={(e) => {
                    e.preventDefault();
                    localStorage.removeItem("AUTH_SESSION");
                    localStorage.removeItem("tutorObjList");

                    signOut().catch(console.error);
                }}
            >
                <div className="flex flex-row justify-between items-center gap-3">
                    <LogOut className="w-4 h-4 ml-2 " />
                    <h1 className="text-[15px] font-outfit">
                        Sign out of Educado
                    </h1>
                </div>
            </Button>
        </div>
    );
};
export default Logout;
