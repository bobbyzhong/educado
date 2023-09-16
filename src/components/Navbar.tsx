import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "./SignInButton";
import { Button } from "./ui/button";
import Image from "next/image";

const Navbar = async () => {
    const session = await getAuthSession();
    return (
        <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300  py-3 ">
            <div className="flex items-center justify-between h-full gap-2 md:px-8 px-3 mx-auto max-w-7xl">
                {/* Logo */}
                <Link href={"/"} className="flex items-center flex-row ">
                    <Image
                        className="w-[2rem] hover:-translate-y-[2px] mr-2 transition-all"
                        src={"/avocado.png"}
                        height={800}
                        width={800}
                        alt=""
                    />
                    <p className="font-outfit ml-1 md:text-3xl text-2xl transition-all hover:-translate-y-[2px] md:block dark:text-white1">
                        <span className="md:text-3xl text-2xl">Educado</span>
                    </p>
                </Link>
                <div className="flex items-center">
                    {session?.user ? (
                        <>
                            <ThemeToggle className="mr-4" />
                            <UserAccountNav user={session.user} />
                            <div className="ml-3 border-l-2 pl-3">
                                <h1 className="text-lg font-semibold ">
                                    {session.user.name}
                                </h1>
                                <p className="text-[13px] ">Teacher</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-row items-center text-center text-sm md:text-lg justify-center space-x-3 md:space-x-6 font-outfit">
                            <Link href={"/contact"}>
                                <p>Contact</p>
                            </Link>
                            <Link href={"/demo"}>
                                <p>Book Demo</p>
                            </Link>

                            <SignInButton text={"Try It Out"} />

                            {/* <SignInButton text={"Sign In"} /> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
