"use client";
import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/components/tutor/useAutosizeTextarea";
import Link from "next/link";
import { Loader2, Mic, SendHorizonal } from "lucide-react";
import useSpeechRecognition from "../../../customHooks/SpeechHook";
import OpenAI from "openai";

type Props = {
    tutorName: string;
    tutorDisplayName: string;
    ownerName: string;
    tutorId: string;
    teacherId: string;
    placeholderQs: string;
    userId: string;
    studentName: string;
    defaultPrompt: string;
    tutorType: string;

    assistantId: string;
};

export default function GeneralChatSection({
    tutorName,
    tutorDisplayName,
    ownerName,
    tutorId,
    teacherId,
    placeholderQs,
    userId,
    studentName,
    defaultPrompt,
    tutorType,

    assistantId,
}: Props) {
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [threadId, setThreadId] = React.useState<string | null>(null);

    const [messages, setMessages] = React.useState<
        { role: string; content: any }[]
    >([]);

    const examples = placeholderQs.split(",");

    const handleKeypress = (e: any) => {
        // It's triggers by pressing the enter key
        if (e.keyCode == 13 && !e.shiftKey) {
            onHandleSubmit(e);
            e.preventDefault();
        }
    };

    const handleInputChange = (e: any) => {
        setInput(e.target.value);
    };

    const onHandleSubmit = async (e: any) => {
        let tempThreadId = "";
        if (messages.length === 0) {
            const response = await fetch("/api/createThread", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const { threadId } = await response.json();
                tempThreadId = threadId;
                setThreadId(threadId);
            } else {
                console.error("Thread creation failed");
            }
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", content: input },
        ]);
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch("/api/assistant-testing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tutorId: tutorId,
                    tutorName: tutorName,
                    ownerName: ownerName,
                    studentName: studentName,
                    userId: userId,
                    teacherId: teacherId,
                    defaultPrompt: defaultPrompt,
                    tutorDisplayName: tutorDisplayName,
                    studentQuestion: input,
                    threadId: tempThreadId ? tempThreadId : threadId,
                    assistantId: assistantId,
                }),
            });

            if (response.ok) {
                const { message } = await response.json();
                console.log(message);

                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "assistant", content: message }, // Assuming "response" contains the AI's reply
                ]);

                console.log("messages: ", messages);
            } else {
                console.error("API request failed");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, input);

    const {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport,
    } = useSpeechRecognition();

    useEffect(() => {
        setInput(text); // Set the input value to text
    }, [text]);

    const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

    // ----------------
    // Tutor Chat Section
    // ----------------
    return (
        <div className="w-full flex justify-between items-center flex-col ">
            <div
                // onScroll={(e) => {
                //     handleScrollMode(e);
                // }}
                className="flex 
                  items-center w-full mb-5 flex-1 flex-col overflow-y-scroll  "
            >
                <div className="max-w-[50rem] ">
                    {messages.length > 0 ? (
                        messages.map((m: any) => (
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
                        <div className="mt-5 md:mt-10 mx-3 font-outfit flex flex-col items-center justify-center">
                            <Image
                                src={"/tutor_image.png"}
                                height={150}
                                width={150}
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
                                    Ask me anything you want, I'm here to help!
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8">
                                {examples.map((example, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(example);
                                            textAreaRef.current?.focus();
                                        }}
                                        className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left
                                         text-base text-gray-500 transition-all duration-75 hover:border-green hover:-translate-y-1
                                          hover:text-green active:bg-gray-50"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {isLoading && (
                        <div className="px-5 rounded-lg flex flex-row items-start py-5 gap-4">
                            <Image
                                src={"/educadoIcon.png"}
                                height={45}
                                width={45}
                                alt={"Steve: "}
                                className="object-contain "
                            />

                            <div className="flex flex-row items-center justify-center ">
                                <div className="animate-pulse text-5xl text-green ">
                                    .
                                </div>
                                <div className="animate-pulse text-5xl text-green ">
                                    .
                                </div>
                                <div className="animate-pulse text-5xl text-green ">
                                    .
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        className=" h-[12px] w-full "
                        // ref={chatContainerRef}
                    ></div>
                </div>
            </div>
            <div className="w-full min-h-[7rem] "></div>

            <div
                className=" w-full fixed bottom-0
              bg-green3 dark:bg-inherit dark:border-t-2 "
            >
                {isLoading && messages.length > 2 && (
                    <div className="w-full flex justify-center">
                        <div className="absolute -translate-y-14 font-outfit text-white1 text-[15px]">
                            <div className="flex flex-row gap-1 animate-pulse rounded-full bg-green px-3 py-[1px]">
                                <h1>Scroll Down </h1>
                                {/* <MoveDown size={18} /> */}
                            </div>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={onHandleSubmit}
                    className="stretch mx-2 flex flex-col gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl -translate-y-6"
                >
                    <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                        <div
                            className="flex flex-row justify-center items-center pr-5 w-full py-3 flex-grow md:py-4 text-[18px] pl-2 md:pl-4 relative 
                             bg-white bg-gradient-to-b dark:border-gray-900/50 rounded-md
                          shadow-[1px_2px_5px_3px_rgba(0,0,0,0.10)] 
                       "
                        >
                            {hasRecognitionSupport ? (
                                <div>
                                    {isListening ? (
                                        <Mic
                                            className="cursor-pointer mr-2"
                                            color="#86D20A"
                                            onClick={() => {
                                                stopListening();
                                            }}
                                        />
                                    ) : (
                                        <Mic
                                            className="cursor-pointer mr-2"
                                            color="#D3D3D3"
                                            onClick={() => {
                                                startListening();
                                            }}
                                        />
                                    )}
                                </div>
                            ) : null}

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
                                  focus:ring focus:ring-green text-[17px] rounded-none focus-visible:ring-0  pl-2 dark:text-black
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
                <div className=" hidden w-full md:grid md:grid-cols-7 justify-center ">
                    <div className=" w-full flex justify-start items-center pl-3 pb-3">
                        <Link
                            href={"/pastConvos"}
                            target="_blank"
                            className="text-center w-[139px] hidden md:block justify-end bg-green font-medium text-white1 rounded-md px-1 py-2 cursor-pointer text-[13.5px] "
                        >
                            <p>Chat History</p>
                        </Link>
                    </div>

                    <div
                        className="w-full col-start-2 col-end-7 lg:col-start-3 lg:col-end-6  flex mb-5 text-[15px] font-outfit items-center justify-center 
                md:px-0 "
                    >
                        <h1 className=" text-center flex flex-row items-center gap-2">
                            Created by your teacher with some help from{" "}
                            <Link
                                href="/"
                                target="_blank"
                                className="text-green cursor-pointer flex flex-row items-center hover:-translate-y-[1px]"
                            >
                                <Image
                                    className=" w-[15px]  mr-1 md:mr-2 transition-all"
                                    src={"/avocado.png"}
                                    height={700}
                                    width={700}
                                    alt=""
                                />
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
