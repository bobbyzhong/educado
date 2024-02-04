"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/components/tutor/useAutosizeTextarea";
import Link from "next/link";
import { Globe, Loader2, Mic, SendHorizonal } from "lucide-react";
import useSpeechRecognition from "../../../customHooks/SpeechHook";
import { is } from "date-fns/locale";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
    teacherId: string;
    placeholderQs: string;
    userId: string;
    studentName: string;
    defaultPrompt: string;
    tutorType: string;
    essayPrompt: string;
};

export default function ChatSection({
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
    essayPrompt,
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
            studentName: studentName,
            userId: userId,
            teacherId: teacherId,
            defaultPrompt: defaultPrompt,
            tutorDisplayName: tutorDisplayName,
            tutorType: tutorType,
        },
    });
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, input);

    const examples = placeholderQs.split(",");

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

    const [isRecording, setIsRecording] = useState(false);
    const [language, setLanguage] = useState("en-US");
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    setTranscript(
                        (transcript) =>
                            transcript + event.results[i][0].transcript
                    );
                    recognition.abort();
                    setIsRecording(false);
                }
            }
        };

        if (isRecording) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => recognition.abort();
    }, [isRecording, language]);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };
    useEffect(() => {
        setInput(transcript); // Set the input value to text
    }, [transcript]);
    useEffect(() => {
        setTranscript(input); // Set the input value to text
    }, [input]);

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
                                {tutorType === "Writing" ? (
                                    <div>
                                        <p className="text-lg text-center font-light mt-5 w-full">
                                            Hey, I'm here to help you with
                                            writing your essay! I'd be more than
                                            happy to help you brainstorm,
                                            revise, and help you improve your
                                            essay. Here is the prompt of the
                                            essay I can help with:
                                        </p>
                                        <p className="text-center mt-2 font-semibold tracking-wide">
                                            {essayPrompt}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-lg text-center font-light mt-5 w-full">
                                        I’m a tutor for {ownerName}’s class.
                                        Whether you didn’t really understand a
                                        certain topic or want to study together
                                        before your next test, I’m here to help!{" "}
                                    </p>
                                )}
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
                        <div className="flex flex-row">
                            <div
                                className="flex flex-row justify-center items-center pr-5 w-full py-3 flex-grow md:py-4 text-[18px] pl-2 md:pl-4 relative 
                             bg-white bg-gradient-to-b dark:border-gray-900/50 rounded-lg
                          shadow-[1px_1px_2px_2px_rgba(0,0,0,0.1)] 
                       "
                            >
                                <div className="mr-2 cursor-pointer">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Globe size={23} color="#D3D3D3" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>
                                                Audio Language
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("ar-AE")
                                                }
                                                disabled={language === "ar-AE"}
                                            >
                                                Arabic
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("zh-CN")
                                                }
                                                disabled={language === "zh-CN"}
                                            >
                                                Chinese
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("yue-Hant-HK")
                                                }
                                                disabled={
                                                    language === "yue-Hant-HK"
                                                }
                                            >
                                                Chinese (Cantonese)
                                            </DropdownMenuCheckboxItem>

                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("cs")
                                                }
                                                disabled={language === "cs"}
                                            >
                                                Czech
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("nl-NL")
                                                }
                                                disabled={language === "nl-NL"}
                                            >
                                                Dutch
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("en-US")
                                                }
                                                disabled={language === "en-US"}
                                            >
                                                English
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("fr-FR")
                                                }
                                                disabled={language === "fr-FR"}
                                            >
                                                French
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("de-DE")
                                                }
                                                disabled={language === "de-DE"}
                                            >
                                                German
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("it-IT")
                                                }
                                                disabled={language === "it-IT"}
                                            >
                                                Italian
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("ja")
                                                }
                                                disabled={language === "ja"}
                                            >
                                                Japanese
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("ko")
                                                }
                                                disabled={language === "ko"}
                                            >
                                                Korean
                                            </DropdownMenuCheckboxItem>

                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("pt-PT")
                                                }
                                                disabled={language === "pt-PT"}
                                            >
                                                Portuguese
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("ru")
                                                }
                                                disabled={language === "ru"}
                                            >
                                                Russian
                                            </DropdownMenuCheckboxItem>

                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("es-US")
                                                }
                                                disabled={language === "es-US"}
                                            >
                                                Spanish
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("tr")
                                                }
                                                disabled={language === "tr"}
                                            >
                                                Turkish
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() =>
                                                    setLanguage("vi-VN")
                                                }
                                                disabled={language === "vi-VN"}
                                            >
                                                Vietnamese
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

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
                                {true ? (
                                    <div>
                                        {isRecording ? (
                                            <Mic
                                                className="cursor-pointer"
                                                color="#86D20A"
                                                onClick={() => {
                                                    toggleRecording();
                                                }}
                                            />
                                        ) : (
                                            <Mic
                                                className="cursor-pointer "
                                                color="#D3D3D3"
                                                onClick={() => {
                                                    toggleRecording();
                                                }}
                                            />
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center bg-white rounded-xl ml-2 
                               shadow-[1px_1px_1px_1px_rgba(0,0,0,0.1)] 
                                transition ease-in-out    px-4 py-1"
                                >
                                    <Loader2
                                        color="#86D20A"
                                        className="animate-spin"
                                        size={26}
                                    />
                                </div>
                            ) : (
                                <div
                                    onClick={onHandleSubmit}
                                    className="flex items-center justify-center cursor-pointer bg-white rounded-xl ml-2 
                                shadow-[1px_2px_1px_3px_rgba(0,0,0,0.10)] hover:shadow-[1px_1px_1px_1px_rgba(0,0,0,0.1)] 
                                transition ease-in-out    px-4 py-1"
                                >
                                    <SendHorizonal
                                        color={
                                            input.length === 0
                                                ? "#D3D3D3"
                                                : "#86D20A"
                                        }
                                        size={26}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                <div className=" hidden w-full md:grid md:grid-cols-7 justify-center ">
                    <div className=" w-full flex justify-start items-center pl-3 pb-3">
                        <div className="flex flex-col">
                            <Link
                                href={"/pastConvos"}
                                target="_blank"
                                className="text-center w-[139px] hidden md:block justify-end bg-green font-medium text-white1 rounded-md px-1 py-2 cursor-pointer text-[13.5px] "
                            >
                                <p>Chat History</p>
                            </Link>
                        </div>
                    </div>

                    <div
                        className="w-full col-start-2 col-end-7 lg:col-start-3 lg:col-end-6  flex mb-5 text-[15px] font-outfit items-center justify-center 
                md:px-0 "
                    >
                        {essayPrompt ? (
                            <div className="font-medium text-[16px] text-center">
                                <b>Prompt</b>: {essayPrompt}
                            </div>
                        ) : (
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
                        )}
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
