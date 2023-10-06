"use client";
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { useChat } from "ai/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkInResponseSchema } from "@/schemas/form/quiz";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/components/tutor/useAutosizeTextarea";
import Link from "next/link";
import { Loader2, Send, SendHorizonal } from "lucide-react";

const examples = [
    "Give me a bullet list of facts about temperature",
    "Help me study for the test we have tomorrow",
    "Quiz me on matter and its interactions",
    "Can you explain the cycle of water on Earth?",
];

type Props = {
    tutorName: string;
    tutorDisplayName: string;
    ownerName: string;
    tutorId: string;
    tempQuestions: string;
    userId: string;
    studentName: string;
};

export default function ChatSection({
    tutorName,
    tutorDisplayName,
    ownerName,
    tutorId,
    tempQuestions,
    userId,
    studentName,
}: Props) {
    const {
        messages,
        input,
        handleInputChange,
        setInput,
        handleSubmit,
        isLoading,
    } = useChat({
        api: "/api/tutor",
        body: {
            tutorId: tutorId,
            tutorName: tutorName,
            ownerName: ownerName,
            studentName: studentName,
            userId: userId,
        },
    });
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, input);

    // The code below are designed to allow autoscroll for the streaming text response but also allow user to manually scroll up if they like without the page autoscrolling back down.
    const [autoscroll, setAutoscroll] = useState(true);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (autoscroll && chatContainerRef.current) {
            chatContainerRef.current?.scrollIntoView({
                behavior: "instant",
                block: "end",
                inline: "start",
            });
        }
    }, [autoscroll, messages, isLoading]);

    const handleScrollMode = (e: React.UIEvent<HTMLElement>) => {
        const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
        const currentScrollPos = clientHeight + scrollTop;
        if (currentScrollPos > scrollHeight - 5) {
            if (autoscroll === true) return;
            setAutoscroll(true);
        } else {
            if (autoscroll === false) return;
            setAutoscroll(false);
        }
    };
    const handleKeypress = (e: any) => {
        // It's triggers by pressing the enter key
        if (e.keyCode == 13 && !e.shiftKey) {
            onHandleSubmit(e);
            e.preventDefault();
        }
    };

    const onHandleSubmit = async (e: any) => {
        handleSubmit(e);
    };

    // ----------------
    // Tutor Chat Section
    // ----------------
    return (
        <div className="w-full flex justify-between items-center flex-col ">
            <div
                onScroll={(e) => {
                    handleScrollMode(e);
                }}
                className="flex 
                  items-center w-full  flex-1 flex-col overflow-y-scroll  "
            >
                <div className="max-w-[50rem] ">
                    {messages.length > 0 ? (
                        messages.map((m) => (
                            <div key={m.id} className="my-3">
                                {m.role === "user" ? (
                                    <div className="px-5 rounded-lg flex flex-row items-start py-5 gap-4">
                                        <Image
                                            src={"/userIcon.png"}
                                            height={45}
                                            width={45}
                                            alt={"User: "}
                                            className="object-contain"
                                        />
                                        <ReactMarkdown className={"prose"}>
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="bg-green3 px-5 rounded-lg flex flex-row items-start py-5 gap-4">
                                        <Image
                                            src={"/educadoIcon.png"}
                                            height={45}
                                            width={45}
                                            alt={"Steve: "}
                                            className="object-contain "
                                        />
                                        <ReactMarkdown className={" prose "}>
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        // ----------------
                        // Tutor introduction when there are no messages
                        // ----------------
                        <div className="mt-0 md:mt-10 mx-3 font-outfit flex flex-col items-center justify-center">
                            <Image
                                src={"/tutor_image.png"}
                                height={175}
                                width={175}
                                alt={""}
                                className=""
                            />

                            <div className="flex w-full items-center justify-center flex-col">
                                <h1 className="text-4xl font-semibold text-center">
                                    Hey, I’m{" "}
                                    <span className="text-green">
                                        {tutorDisplayName}!
                                    </span>
                                </h1>
                                <p className="text-lg text-center font-light mt-5 w-full">
                                    I’m your tutor for {ownerName}’s class. You
                                    can ask me for help with anything related to
                                    her class. Whether you didn’t really
                                    understand a certain topic or want to study
                                    together before you next test, I’m here to
                                    help!
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8">
                                {examples.map((example, i) => (
                                    <button
                                        key={i}
                                        className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left
                                         text-base text-gray-500 transition-all duration-75 hover:border-green hover:-translate-y-1
                                          hover:text-green active:bg-gray-50"
                                        onClick={() => {
                                            setInput(example);
                                            textAreaRef.current?.focus();
                                        }}
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div
                        className=" h-[12px] w-full "
                        ref={chatContainerRef}
                    ></div>
                </div>
            </div>
            <div className="w-full min-h-[7rem] "></div>
            <div
                className=" w-full fixed bottom-0
              bg-green3 "
            >
                <form
                    onSubmit={onHandleSubmit}
                    className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl -translate-y-6"
                >
                    <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                        <div
                            className="flex flex-row justify-center items-center pr-5 w-full py-3 flex-grow md:py-4 text-[18px] pl-2 md:pl-5 relative 
                             bg-white bg-gradient-to-b dark:border-gray-900/50 rounded-md
                          shadow-[1px_2px_5px_3px_rgba(0,0,0,0.10)] 
                       "
                        >
                            <Textarea
                                value={input}
                                tabIndex={0}
                                ref={textAreaRef}
                                style={{
                                    height: "24px",
                                    maxHeight: "175px",
                                    overflowY: "hidden",
                                }}
                                placeholder="Ask me anything ..."
                                className="m-0 w-full min-h-0 shadow-none  resize-none  border-0 bg-transparent p-0 pr-7
                                  focus:ring focus:ring-green text-[17px] rounded-none focus-visible:ring-0  pl-2
                                  md:pl-0"
                                onChange={handleInputChange}
                                onKeyDown={handleKeypress}
                            />
                            {isLoading ? (
                                <Loader2
                                    color="#86D20A"
                                    className="animate-spin"
                                    size={26}
                                />
                            ) : (
                                <SendHorizonal
                                    className="cursor-pointer"
                                    onClick={onHandleSubmit}
                                    color={
                                        input.length === 0
                                            ? "#D3D3D3"
                                            : "#86D20A"
                                    }
                                    size={26}
                                />
                            )}
                        </div>
                    </div>
                </form>
                <div className="w-full grid grid-cols-3 justify-center ">
                    <div className="w-full flex justify-start items-center pl-3 pb-3">
                        <Link
                            href={"/pastConvos"}
                            target="_blank"
                            className="text-center w-[139px] justify-end bg-green font-medium text-white1 rounded-md px-1 py-2 cursor-pointer text-[13.5px] "
                        >
                            <p>View Chat History</p>
                        </Link>
                    </div>

                    <div
                        className="md:w-full w-9/12 flex mb-5 text-[15px] font-outfit items-center justify-center 
                md:px-0 "
                    >
                        <h1 className=" text-center">
                            Created by your teacher with some help from 🥑{" "}
                            <Link
                                href="/"
                                target="_blank"
                                className="text-green cursor-pointer"
                            >
                                Educado
                            </Link>
                        </h1>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
