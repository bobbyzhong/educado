"use client";
import { ArrowRightCircle } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {};
const StudentEnterCode = (props: Props) => {
    const [code, setCode] = useState("");
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // You can perform any action with the inputText here, e.g., send it to an API, display it on the page, etc.
        router.push(`/check-in/${code}`);
    };

    const handleChange = (e: any) => {
        setCode(e.target.value);
    };

    return (
        <div className="w-full flex items-center justify-center mt-5">
            <div className="flex flex-row gap-2 items-center justify-center">
                <h1 className="text-[19px] text-zinc-800 font-[520] ">
                    <span className="text-green font-[650] tracking-wide">
                        Student?{" "}
                    </span>
                    Enter code here
                </h1>
                <form
                    className="flex flex-row items-center justify-center gap-1"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Enter Code"
                        value={code}
                        onChange={handleChange}
                        className="px-2 py-1 border-green border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                    />
                    <ArrowRightCircle
                        cursor={"pointer"}
                        color="#7EBA1B"
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
