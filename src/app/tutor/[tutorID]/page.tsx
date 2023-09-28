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

export default function Chat() {
    const [studentName, setStudentName] = useState("");

    const { messages, input, handleInputChange, handleSubmit, isLoading } =
        useChat({
            api: "/api/tutor",
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

    const onHandleSubmit = (e: any) => {
        fetch("/api/logToCSV", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: studentName,
                latestQuestion: input,
            }),
        });

        handleSubmit(e);
    };

    function onSubmit(input: any) {
        setStudentName(input.name);
    }
    const form = useForm<any>({
        resolver: zodResolver(checkInResponseSchema),
        defaultValues: {
            name: "",
        },
    });
    if (studentName === "") {
        return (
            <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <Card className="py-5 pb-0">
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg">
                                                Your Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Smith"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Make sure you put your full name
                                                and have no typos
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button variant={"green"} type="submit">
                                    Continue
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="w-full flex justify-center items-center flex-col bg-white1">
            <div
                onScroll={(e) => {
                    handleScrollMode(e);
                }}
                className="flex h-[73.5vh] md:h-[79vh] xl:h-[79vh] border-green2 border-b items-center flex-col  w-full my-5 overflow-y-scroll"
            >
                <div className="max-w-[50rem]">
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
                                        <ReactMarkdown>
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
                                        <ReactMarkdown className={"leading-7"}>
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="mt-0 md:mt-10 font-outfit flex flex-col items-center justify-center">
                            <Image
                                src={"/tutor_image.png"}
                                height={175}
                                width={175}
                                alt={""}
                                className=""
                            />

                            <div className="flex w-full items-center justify-center flex-col">
                                <h1 className="text-4xl font-semibold text-center">
                                    Hey! I’m{" "}
                                    <span className="text-green">Steve!</span>
                                </h1>
                                <p className="text-lg text-center font-light mt-5 w-11/12">
                                    I’m your super smart avocado tutor for Ms.
                                    Rhynes’s class. You can ask me for help with
                                    anything related to her class. Whether you
                                    didn’t really understand a certain topic or
                                    want to study together before you next test,
                                    I’m here to help!
                                </p>
                            </div>
                        </div>
                    )}

                    <div className=" h-2 w-full " ref={chatContainerRef}></div>
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 w-full 
              dark:bg-gray-800"
            >
                <form
                    onSubmit={onHandleSubmit}
                    className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
                >
                    <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                        <div
                            className="flex flex-col w-full py-3 flex-grow md:py-4 text-[18px] pl-2 md:pl-5 relative 
                             bg-white dark:border-gray-900/50 rounded-md
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
                                placeholder="Ask me anything..."
                                className="m-0 w-full min-h-0 shadow-none  resize-none  border-0 bg-transparent p-0 pr-7
                                  focus:ring focus:ring-green text-[17px] rounded-none focus-visible:ring-0  pl-2
                                  md:pl-0"
                                onChange={handleInputChange}
                                onKeyDown={handleKeypress}
                            />
                        </div>
                    </div>
                </form>
                <div className="w-full flex my-5 text-[15px] font-outfit items-center justify-center">
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
            </div>
        </div>
    );
}
