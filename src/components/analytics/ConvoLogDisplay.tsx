"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

import "react-photo-view/dist/react-photo-view.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import {
    ChevronRightCircle,
    ChevronsDown,
    ChevronsUp,
    Loader2,
} from "lucide-react";
import { Input } from "../ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

type Props = {
    studentId: string;
    studentName: string;
};

const FormSchema = z.object({
    limit: z.string(),
});

export default function ConvoLogDisplay({ studentId, studentName }: Props) {
    const bottomRef = useRef<any>(null);
    const topRef = useRef<any>(null);
    const [messages, setMessages] = useState<any>([]);
    const [limit, setLimit] = useState<number>(50);
    const [limitInput, setLimitInput] = useState<number>(50);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            limit: "50",
        },
    });

    const convertLatexDeliminators = (text: string) => {
        // replace \\( with $ and \\) with $, and also \\[ with $$ and \\] with $$
        return text.replace(/(\\\[)|(\\\()|(\\\])|(\\\))/g, (match) => {
            switch (match) {
                case "\\[":
                    return "$$";
                case "\\(":
                    return "$";
                case "\\]":
                    return "$$";
                case "\\)":
                    return "$";
                default:
                    return match; // should not be reached, but added for robustness
            }
        });
    };
    const fetchMessages = async () => {
        const res = await fetch(`/api/getQuestionsById`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentId: studentId, limit: limitInput }),
        });
        const data = await res.json();
        setMessages(data.reversedQuestions);
    };

    const fetchMessagesCustom = async (limit: any) => {
        const res = await fetch(`/api/getQuestionsById`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentId: studentId, limit: limit }),
        });
        const data = await res.json();
        setMessages(data.reversedQuestions);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToTop = () => {
        topRef.current.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    };
    const handleLimitSubmit = (e: any) => {
        fetchMessagesCustom(parseInt(form.getValues().limit));
        setLimit(parseInt(form.getValues().limit));
    };

    return (
        <main ref={topRef}>
            <div
                className="fixed top-28 right-16 cursor-pointer border-2 border-[#7EBA1B] transition ease-in-out hover:-translate-y-1 rounded-full p-1"
                onClick={scrollToTop}
            >
                <ChevronsUp color={"#7EBA1B"} />
            </div>
            <div
                className="fixed bottom-16 right-16 cursor-pointer border-2 border-[#7EBA1B] transition ease-in-out hover:translate-y-1 rounded-full p-1"
                onClick={scrollToBottom}
            >
                <ChevronsDown color={"#7EBA1B"} />
            </div>
            <div className="flex flex-col w-full justify-center items-center">
                <h1 className="text-2xl font-semibold">
                    Chat Logs of {studentName}
                </h1>
                <div className="mt-2 ">
                    <h1 className=" mb-5">
                        Currently showing {limit} most recent questions
                    </h1>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <h1 className="min-w-[7rem]">Change Limit</h1>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleLimitSubmit)}
                                className="flex flex-row items-center justify-center gap-2"
                            >
                                <FormField
                                    control={form.control}
                                    name="limit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button variant={"ghost"} type="submit">
                                    <ChevronRightCircle
                                        color={"#9e9ea5"}
                                        size={26}
                                    />
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-between items-center flex-col ">
                <div
                    // onScroll={(e) => {
                    //     handleScrollMode(e);
                    // }}
                    className="flex 
                  items-center w-full mb-5 flex-1 flex-col overflow-y-scroll  "
                >
                    <div className="max-w-[50rem] ">
                        <div className="mt-3 mx-3 flex flex-col items-center justify-center">
                            <div className="mt-[1.5rem]">
                                {messages.length > 0 &&
                                    messages.map((m: any) => (
                                        <div key={m.id} className="my-3 ">
                                            <div className=" px-5 rounded-lg md:min-w-[48rem] flex flex-row items-start py-5 gap-4">
                                                <Image
                                                    src={"/userIcon.png"}
                                                    height={45}
                                                    width={45}
                                                    alt={"User: "}
                                                    className="object-contain"
                                                />
                                                <ReactMarkdown
                                                    className="flex flex-col leading-8 prose"
                                                    remarkPlugins={[remarkMath]}
                                                    rehypePlugins={[
                                                        rehypeKatex,
                                                        rehypeMathjax,
                                                    ]}
                                                >
                                                    {convertLatexDeliminators(
                                                        m.question
                                                    )}
                                                </ReactMarkdown>
                                            </div>

                                            <div className=" bg-green3 px-5 md:min-w-[48rem] rounded-lg flex flex-row items-start py-5 gap-4">
                                                <Image
                                                    src={"/educadoIcon.png"}
                                                    height={45}
                                                    width={45}
                                                    alt={"Steve: "}
                                                    className="object-contain "
                                                />
                                                <ReactMarkdown
                                                    className="flex flex-col leading-8 prose"
                                                    remarkPlugins={[remarkMath]}
                                                    rehypePlugins={[
                                                        rehypeKatex,
                                                        rehypeMathjax,
                                                    ]}
                                                >
                                                    {convertLatexDeliminators(
                                                        m.answer
                                                    )}
                                                </ReactMarkdown>
                                                {/* <Latex>
                                                                {m.content}
                                                            </Latex> */}
                                            </div>
                                        </div>
                                    ))}

                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2
                                            color={"#9e9ea5"}
                                            className="animate-spin"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className=" h-[5px] w-full "></div>
                </div>
            </div>
            <div
                ref={bottomRef}
                className="w-full flex justify-center min-h-[2rem] mb-5 text-zinc-500 text-sm"
            >
                <h1>End of Conversation.</h1>
            </div>
        </main>
    );
}
