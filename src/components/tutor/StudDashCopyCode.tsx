"use client";
import React from "react";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "../ui/use-toast";

type Props = { code: string; key: string };
const StudDashCopy = ({ code, key }: Props) => {
    const { toast } = useToast();

    return (
        <div
            onClick={() => {
                toast({
                    title: "Copied!",
                    description: "Code copied to clipboard.",
                });
                navigator.clipboard.writeText(code);
            }}
            className="bg-green shrink-0 text-white1 font-medium px-3 py-1
             rounded-full cursor-pointer"
            key={key}
        >
            {code}
        </div>
    );
};
export default StudDashCopy;
