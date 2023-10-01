"use client";
import React from "react";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "./ui/use-toast";

type Props = { code: string };
const CodeDisplay = ({ code }: Props) => {
    const { toast } = useToast();

    return (
        <h2 className="mr-2 text-xl flex flex-row items-end gap-2 text-zinc-500 tracking-tight">
            Share Code:{" "}
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
                <span className="text-3xl font-bold tracking-tight text-green">
                    {code}
                </span>
                <ClipboardCopy size={28} />
            </div>
        </h2>
    );
};
export default CodeDisplay;
