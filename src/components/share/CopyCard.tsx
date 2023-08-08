"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

type Props = { link: string };
const CopyCard = ({ link }: Props) => {
    const { toast } = useToast();

    return (
        <Card
            onClick={() => {
                toast({
                    title: "Copied!",
                    description: "Link copied to clipboard.",
                });
                navigator.clipboard.writeText(link);
            }}
            className="hover:cursor-pointer hover:-translate-y-[2px] transition-all hover:opacity-75 flex rounded-md shadow-sm p-3 "
        >
            <CardHeader className="flex flex-row items-center justify-between w-full space-y-0 mb-0">
                <CardTitle className="text-[19px] font-bold tracking-tight">
                    Copy Link
                </CardTitle>
                <ClipboardCopy />
            </CardHeader>
        </Card>
    );
};
export default CopyCard;
