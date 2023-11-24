import { Button } from "@/components/ui/button";

import { getAuthSession } from "@/lib/nextauth";

import SignInButtonLg from "@/components/SignInButtonLg";
import WhyUsCard from "@/components/landing/WhyUsCard";
import Link from "next/link";
import Image from "next/image";
import StudentEnterCode from "@/components/StudentEnterCode";
import { prisma } from "@/lib/db";
import HomePageJoinCode from "@/components/HomePageJoinCode";

export default async function Custom404() {
    return (
        <div className="flex flex-col font-outfit w-full">
            <div className="flex flex-row items-center justify-center mt-28 text-2xl">
                404 - Page not found
            </div>
            <div className="flex items-center justify-center mt-2">
                Return to{" "}
                <Link href={"/"} className="text-green underline ml-1">
                    {" "}
                    homepage
                </Link>
            </div>
        </div>
    );
}
