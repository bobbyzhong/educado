"use client";
import React from "react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props = { userId: string };
const TeacherCodeInput = ({ userId }: Props) => {
    const [code, setCode] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async () => {
        if (code === "") return;
        if (code === "CCU7W") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "CCUSD",
                }),
            });
            const data = await res.json();
            console.log(data);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        }
    };

    return (
        <div className="flex flex-row items-center justify-center">
            <h1>Are you a teacher? Click here</h1>
            <input
                value={code}
                className="shadown-none border-b"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Teacher code"
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
};
export default TeacherCodeInput;
