"use client";

import * as React from "react";
import { BookKey, ContactIcon, Home, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type Props = {
    mode: string;
    className: string;
};
export function ThemeToggle({ className, mode }: Props) {
    const { setTheme } = useTheme();
    const router = useRouter();

    if (mode == "dashboard") {
        return (
            <div
                className={`${className} flex flex-row items-center justify-center text-center cursor-pointer`}
            >
                <Button
                    onClick={() => router.push("/dashboard-student")}
                    variant="outline"
                    size="icon"
                >
                    <Home size={23} />
                </Button>
                {/* <div className="text-sm ml-2 md:block hidden">Dashboard</div> */}
            </div>
        );
    } else if (mode == "hw-help") {
        return (
            <div
                className={`${className} flex flex-row items-center justify-center text-center cursor-pointer`}
            >
                <Button
                    onClick={() => router.push("/hw-help/")}
                    variant="outline"
                    size="icon"
                >
                    <BookKey size={23} />
                </Button>
                <div className="text-sm ml-2 md:block hidden">Tutors</div>
            </div>
        );
    } else if (mode == "manageHelper") {
        return (
            <div
                className={`${className} flex flex-row items-center justify-center text-center cursor-pointer`}
            >
                <Button
                    onClick={() => router.push("/manage-helpers")}
                    variant="outline"
                    size="icon"
                >
                    <BookKey size={23} />
                </Button>
                <div className="text-sm ml-2 md:block hidden">HW Helpers</div>
            </div>
        );
    } else if (mode == "manageFigure") {
        return (
            <div
                className={`${className} flex flex-row items-center justify-center text-center cursor-pointer`}
            >
                <Button
                    onClick={() => router.push("/manage-figures")}
                    variant="outline"
                    size="icon"
                >
                    <ContactIcon size={23} />
                </Button>
                <div className="text-sm ml-2 md:block hidden">Figures</div>
            </div>
        );
    } else if (mode == "figure") {
        return (
            <div
                className={`${className} flex flex-row items-center justify-center text-center cursor-pointer`}
            >
                <Button
                    onClick={() => router.push("/figures")}
                    variant="outline"
                    size="icon"
                >
                    <ContactIcon size={23} />
                </Button>
                <div className="text-sm ml-2 md:block hidden">Figures</div>
            </div>
        );
    } else {
        return (
            <div className={className}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Go Dashboard</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }
}
