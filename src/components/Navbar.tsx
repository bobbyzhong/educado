import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "./SignInButton";
import { Button } from "./ui/button";
import Image from "next/image";
import NavbarRoute from "./NavbarRoute";
import { prisma } from "@/lib/db";

const Navbar = async () => {
    const session = await getAuthSession();

    const userId = session?.user?.id;

    let user;
    if (session?.user) {
        user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }

    return (
        <div className="fixed inset-x-0 top-0  bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300  py-3 md:pb-3 pb-7">
            <div className="flex items-center justify-between h-full gap-2 md:px-8 px-3 mx-auto max-w-7xl pt-2 md:pt-0">
                {/* Logo */}
                <Link href={"/"} className="flex items-center flex-row ">
                    <Image
                        className=" w-[1.5rem] md:w-[2rem] hover:-translate-y-[2px] mr-1 md:mr-2 transition-all"
                        src={"/avocado.png"}
                        height={700}
                        width={700}
                        alt=""
                    />
                    <p className="font-outfit ml-1 md:text-3xl text-2xl transition-all hover:-translate-y-[2px] md:block dark:text-white1">
                        <span className="md:text-3xl text-[18px]">Educado</span>
                    </p>
                </Link>
                {session?.user && !user?.isTeacher && !user?.isAdmin ? (
                    <div className="flex flex-row items-center justify-center">
                        <ThemeToggle
                            mode={"dashboard"}
                            className="md:ml-8 mx-3"
                        />
                        {/* <ThemeToggle mode={"hw-help"} className="mx-3" /> */}
                        {/* <ThemeToggle mode={"figure"} className="mx-3" /> */}
                    </div>
                ) : (
                    <></>
                )}
                {(session?.user && user?.isTeacher) || user?.isAdmin ? (
                    <div className="flex flex-row items-center justify-center">
                        <ThemeToggle
                            mode={"dashboard"}
                            className="md:ml-8 mx-3"
                        />
                        <ThemeToggle mode={"manageHelper"} className="mx-3" />
                        <ThemeToggle mode={"manageFigure"} className="mx-3" />
                    </div>
                ) : (
                    <></>
                )}
                <div className="flex items-center ">
                    {session?.user ? (
                        <>
                            {/* <ThemeToggle home={false} className="mr-4" /> */}
                            <UserAccountNav user={session.user} />
                            <div className="md:block hidden ml-3 border-l-2 pl-3">
                                <h1 className="text-lg font-semibold ">
                                    {session.user.name}
                                </h1>
                                {user?.isAdmin ? (
                                    <p className="text-[13px] ">Admin</p>
                                ) : user?.isTeacher ? (
                                    <p className="text-[13px] ">Teacher</p>
                                ) : (
                                    <p className="text-[13px] ">Student</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-row items-center text-center text-sm md:text-lg justify-center space-x-2 md:space-x-6 font-outfit">
                            <Link href={"/contact"}>
                                <p>Contact</p>
                            </Link>
                            <Link href={"/demo"}>
                                <p>Book Demo</p>
                            </Link>

                            <SignInButton text={"Sign In"} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
