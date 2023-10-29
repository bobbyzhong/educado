"use client";
import React from "react";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "./ui/use-toast";

type Props = { code: string };
const CodeDisplay = ({ code }: Props) => {
    const { toast } = useToast();

    return (
        <h2 className="text-[#C5C5C5] font-extrabold tracking-tight text-lg">
            SHARE CODE{" "}
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
                <span className="text-3xl font-[600] tracking-tight text-green">
                    {code}
                </span>
                <ClipboardCopy size={23} />
            </div>
        </h2>
    );
};
export default CodeDisplay;
