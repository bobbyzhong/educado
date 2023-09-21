"use client";
import React from "react";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "./ui/use-toast";

type Props = { code: string };
const CodeDisplay = ({ code }: Props) => {
    const { toast } = useToast();

    return (
        <h2 className="mr-2 text-[30px] flex flex-row justify-center items-center gap-3 font-semibold text-zinc-500 tracking-tight">
            Check-In Code:{" "}
            <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                onClick={() => {
                    toast({
                        title: "Copied!",
                        description: "Code copied to clipboard.",
                    });
                    navigator.clipboard.writeText(code);
                }}
            >
                <span className="font-bold text-[30px] text-zinc-950">
                    {code}
                </span>
                <ClipboardCopy size={28} />
            </div>
        </h2>
    );
};
export default CodeDisplay;
