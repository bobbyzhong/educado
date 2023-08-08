import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "./SignInButton";

const Navbar = async () => {
    const session = await getAuthSession();
    return (
        <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300  py-3 ">
            <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
                {/* Logo */}
                <Link href={"/"} className="flex items-center gap-2">
                    <p className="font-outfit text-3xl transition-all hover:-translate-y-[2px] md:block dark:text-white1">
                        🍐 <span className="text-3xl">Pear</span>
                    </p>
                </Link>
                <div className="flex items-center">
                    <ThemeToggle className="mr-4" />
                    {session?.user ? (
                        <>
                            <UserAccountNav user={session.user} />
                            <div className="ml-3 border-l-2 pl-3">
                                <h1 className="text-lg font-semibold ">
                                    {session.user.name}
                                </h1>
                                <p className="text-[13px] ">Teacher</p>
                            </div>
                        </>
                    ) : (
                        <SignInButton text={"Sign In"} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
