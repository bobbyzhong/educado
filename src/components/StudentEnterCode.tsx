"use client";
import { ArrowRightCircle } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    link: string;
    title: string;
    description: string;
    bgRed: boolean;
};
const StudentEnterCode = ({ title, description, link, bgRed }: Props) => {
    const [code, setCode] = useState("");
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // You can perform any action with the inputText here, e.g., send it to an API, display it on the page, etc.
        router.push(`/${link}/${code}`);
    };

    const handleChange = (e: any) => {
        setCode(e.target.value);
    };

    return (
        <div
            className={
                bgRed
                    ? "px-8 py-5 flex items-center justify-center mt-7 rounded-3xl shadow-2xl bg-[#e14e4e]"
                    : "px-8 py-5 flex items-center justify-center mt-7 rounded-3xl shadow-2xl bg-[#86ae46]"
            }
        >
            <div className="flex flex-col gap-3 items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[23px] text-white font-[900] ">
                        {title}
                    </h1>
                    <h1 className="text-[19px] text-white font-[300] ">
                        {description}
                    </h1>
                </div>
                <form
                    className="flex flex-row items-center justify-center gap-1"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Enter Code"
                        value={code}
                        onChange={handleChange}
                        className="px-3 py-2 w-[60%] rounded-lg focus:outline-none"
                    />
                    <ArrowRightCircle
                        cursor={"pointer"}
                        color="white"
                        size={33}
                        type="submit"
                        onClick={handleSubmit}
                    />
                </form>
            </div>
        </div>
    );
};
export default StudentEnterCode;
