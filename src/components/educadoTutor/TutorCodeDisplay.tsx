"use client";
import React from "react";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "../ui/use-toast";

type Props = { code: string };
const TutorCodeDisplay = ({ code }: Props) => {
  const { toast } = useToast();

  return (
    <h2 className="mr-2 text-[40px] flex flex-row justify-center items-center gap-3 font-semibold text-zinc-500 tracking-tight">
      Tutor Key:
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
        <span className="font-bold text-[40px] text-zinc-950">{code}</span>
        <ClipboardCopy size={28} />
      </div>
    </h2>
  );
};
export default TutorCodeDisplay;
