import React from "react";
import Image from "next/image";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Page() {
    return (
        <div className="font-outfit text-center absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex items-center flex-col">
            {/* <div className="text-lg w-10/12 mb-5">
                If you're interested in trying Pear, just send an email or text
                me and I'll provide you a link to sign up! This is to ensure
                that only teachers are using Pear. <br /> Thanks! <br /> Bobby,
                founder of Pear
            </div> */}
            <Card className=" w-full rounded-sm">
                <CardHeader className="h-[60px]">
                    <CardTitle className="text-2xl">Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl">3bobbyzhong3@gmail.com</p>
                </CardContent>
                <CardHeader className=" py-0">
                    <CardTitle className="text-2xl">Phone</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl">(714) 330-9387</p>
                </CardContent>
            </Card>
            <div className="mt-5">
                <Link className=" text-xl" href="/demo">
                    Or{" "}
                    <span className="text-green underline">book a demo!</span>
                </Link>
            </div>
        </div>
    );
}
