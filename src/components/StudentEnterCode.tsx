"use client";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

type Props = {
    link: string;
    title: string;
    description: string;
    bgRed: boolean;
    isSignedIn: any;
    userId?: string;
    recentCodes?: string;
    email?: string;
    tutorObjList?: any;
    studentName?: string;
};
const StudentEnterCode = ({
    title,
    description,
    link,
    bgRed,
    isSignedIn,
    userId,
    recentCodes,
    email,
    tutorObjList,
    studentName,
}: Props) => {
    const [code, setCode] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(
                "AUTH_SESSION",
                JSON.stringify({
                    id: userId,
                    email: email,
                    codes: recentCodes,
                    studentName: studentName,
                })
            );
            localStorage.setItem("tutorObjList", JSON.stringify(tutorObjList));
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        if (isSignedIn) {
            if (link === "tutor") {
                const res = await fetch("/api/updateRecentTutors", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        code: code,
                    }),
                });
            }
            router.push(`/${link}/${code}`);
            setIsLoading(false);
        } else {
            signIn("google", { callbackUrl: `/${link}/${code}` }).catch(
                console.error
            );
            setIsLoading(false);
        }
        // You can perform any action with the inputText here, e.g., send it to an API, display it on the page, etc.
    };

    const handleChange = (e: any) => {
        setCode(e.target.value);
    };

    return (
        <div
            className={
                bgRed
                    ? "px-5 py-5 flex items-center justify-center mt-7 rounded-3xl shadow-xl bg-[#e14e4e]"
                    : "px-5 py-5 flex items-center justify-center mt-7 rounded-3xl shadow-xl bg-[#86ae46]"
            }
        >
            <div className="flex flex-col gap-3 items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[23px] text-white font-[900] ">
                        {title}
                    </h1>
                    {/* <h1 className="text-[19px] text-white font-[300] ">
                        {description}
                    </h1> */}
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

                    {isLoading ? (
                        <Loader2
                            color="#FFF"
                            className="animate-spin"
                            size={26}
                        />
                    ) : (
                        <ArrowRightCircle
                            cursor={"pointer"}
                            color="white"
                            size={33}
                            type="submit"
                            onClick={handleSubmit}
                        />
                    )}
                </form>
            </div>
        </div>
    );
};
export default StudentEnterCode;
