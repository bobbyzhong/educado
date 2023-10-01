"use client";
import { usePathname } from "next/navigation";
import React from "react";
import SignInButton from "./SignInButton";
import Link from "next/link";

type Props = {};
const NavbarRoute = (props: Props) => {
    const pathname = usePathname();
    const rootPath = pathname.split("/")[1];

    if (rootPath === "tutor") {
        return <div></div>;
    } else {
        return (
            <div className="flex flex-row items-center text-center text-sm md:text-lg justify-center space-x-2 md:space-x-6 font-outfit">
                <Link href={"/contact"}>
                    <p>Contact</p>
                </Link>
                <Link href={"/demo"}>
                    <p>Book Demo</p>
                </Link>

                <SignInButton text={"Try It Out"} />
            </div>
        );
    }
};
export default NavbarRoute;
