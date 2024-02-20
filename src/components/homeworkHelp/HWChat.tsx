"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/components/tutor/useAutosizeTextarea";
import Link from "next/link";
import {
    Globe,
    Loader2,
    Mic,
    Play,
    RefreshCcw,
    SendHorizonal,
} from "lucide-react";
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
import { createWorker } from "tesseract.js";
import { Input } from "../ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { decode } from "punycode";
import { ImageCropModal } from "../ImageCropModal";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

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

export default function HWChat({
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
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [textResult, setTextResult] = useState<any>("");
    const [steps, setSteps] = useState<any>([]);
    const [solveLoading, setSolveLoading] = useState(false);
    const [processingImg, setProcessingImg] = useState(false);
    const [secInput, setSecInput] = useState("");
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [croppedImage, setCroppedImage] = useState<any>(null);
    const [imageFile, setImageFile] = useState<any>(null);
    const [base64, setBase64] = useState();

    const handleSecInputChange = (e: any) => {
        setSecInput(e.target.value);
        setInput(e.target.value);
    };

    const {
        messages,
        input,
        handleInputChange,
        setInput,
        handleSubmit,
        isLoading,
    } = useChat({
        api: "/api/homeworkTutor",
        body: {
            tutorId: tutorId,
            tutorName: tutorName,
            studentName: studentName,
            userId: userId,
            teacherId: teacherId,
            defaultPrompt: defaultPrompt,
            tutorDisplayName: tutorDisplayName,
            tutorType: tutorType,
            homeworkQuestion: textResult,
            steps: steps,
        },
    });

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, input);

    const handleChangeImage = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setCropModalOpen(true);
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            setImageFile(e.target.files[0]);
        }
    };

    const handleStartProblem = async () => {
        if (!croppedImage) return;
        setProcessingImg(true);
        setTextResult("");

        const res = await fetch("/api/mathpix", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                base64: base64,
            }),
        });

        const data: any = await res.json();
        const mathData = data.data;
        console.log("MATHPIX DATA:", mathData);
        setTextResult(mathData.text);
        setSolveLoading(true);
        setProcessingImg(false);
        try {
            const res = await axios.post("/api/ocrTest", {
                textResult: mathData.text,
            });
            const resObj = JSON.parse(res.data.data);
            // const res = `{
            //     "steps": [
            //         "1. Identify the knowns and unknowns: Knowns are the model h = 3a + 286 for height estimation and the age range (2 to 5 years). The unknown is the estimated increase in height per year (coefficient of a).",
            //         "2. Understand the model: The model shows that height (h) is a linear function of age (a).",
            //         "3. Recognize that the coefficient of 'a' in the equation represents the increase in height per year.",
            //         "4. Isolate the coefficient: The coefficient of 'a' in the equation is 3.",
            //         "5. Conclude that the estimated increase in height for a boy each year is 3 inches, as that is the coefficient of the age variable 'a' in the pediatrician's model."
            //     ]
            // }`;
            // const resObj = JSON.parse(res);

            const steps = resObj.steps;
            setSteps(steps);
            setSolveLoading(false);
            messages.push({
                id: "1",
                role: "system",
                content:
                    "What do you think is the first step to solving this problem?",
            });
        } catch (e) {
            setSolveLoading(false);
            console.log("ERROR: ", e);
        }
    };

    const handleKeypress = (e: any) => {
        // It's triggers by pressing the enter key

        if (e.keyCode == 13 && !e.shiftKey) {
            handleSubmit(e);
            setSecInput("");
            setInput("");
            e.preventDefault();
        }
    };

    const onHandleSubmit = async (e: any) => {
        handleSubmit(e);
        setSecInput("");
        setInput("");
    };

    const resetProblem = () => {
        setSteps([]);
        setSelectedImage("");
        setCroppedImage("");
        setTextResult("");
        messages.splice(0, messages.length);
        setSecInput("");
        setInput("");
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
    }, [transcript, setInput]);
    useEffect(() => {
        setTranscript(input); // Set the input value to text
    }, [input]);

    const testMessages = [
        {
            role: "system",
            content:
                "What do you think the first step to solving this problem is?",
        },
        {
            role: "user",
            content:
                "What do you think the first step to solving this problem is?What do you think the first step to solving this problem is?",
        },
    ];

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
                    <div className="mt-12 md:mt-10 mx-3 flex flex-col items-center justify-center ">
                        <div className="flex w-full items-center justify-center flex-col">
                            <h1 className="text-3xl font-semibold text-center">
                                Hey, I’m{" "}
                                <span className="text-green">
                                    {tutorDisplayName}!
                                </span>
                            </h1>
                        </div>
                        <p className="text-base text-center font-light mt-3 w-[70%]">
                            Upload a picture of a specific question you need
                            help with!
                        </p>
                        <p className="text-base text-center font-light mt-3 w-[70%] text-zinc-400">
                            *Please note, this feature is still in beta and will
                            be limited in functionality. The team at Educado is
                            working hard to improve it!*
                        </p>

                        <Input
                            className="cursor-pointer mt-3"
                            type="file"
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                        <div className="mt-5 p-3 border rounded-md w-full flex items-center justify-center">
                            {croppedImage && (
                                <div>
                                    <Image
                                        src={croppedImage}
                                        height={500}
                                        width={500}
                                        alt=""
                                    />
                                </div>
                            )}
                        </div>

                        {/* DELETE THIS */}
                        {/* <div className="flex flex-col">
                            <div className="mt-10 p-5 border-2 w-9/12">
                                <div>
                                    STEPS:
                                    {steps && (
                                        <div>
                                            {steps.map(
                                                (step: any, index: number) => (
                                                    <div key={index}>
                                                        <p>{step}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div> */}
                        {messages.length > 0 &&
                            messages.map((m: any) => (
                                <div key={m.id} className="my-3">
                                    {m.role === "user" ? (
                                        <div className=" px-5 rounded-lg md:min-w-[48rem] flex flex-row items-start py-5 gap-4">
                                            <Image
                                                src={"/userIcon.png"}
                                                height={45}
                                                width={45}
                                                alt={"User: "}
                                                className="object-contain"
                                            />
                                            <Latex>{m.content}</Latex>
                                        </div>
                                    ) : (
                                        <div className=" bg-green3 px-5 md:min-w-[48rem] rounded-lg flex flex-row items-start py-5 gap-4">
                                            <Image
                                                src={"/educadoIcon.png"}
                                                height={45}
                                                width={45}
                                                alt={"Steve: "}
                                                className="object-contain "
                                            />
                                            <Latex>{m.content}</Latex>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>

                    <div className=" h-[12px] w-full "></div>
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
                            {messages.length > 0 && (
                                <div
                                    className="flex flex-row justify-center items-center pr-5 w-full py-3 flex-grow md:py-4 text-[18px] pl-2 md:pl-4 relative 
                             bg-white bg-gradient-to-b dark:border-gray-900/50 rounded-lg
                          shadow-[1px_1px_2px_2px_rgba(0,0,0,0.1)] 
                       "
                                >
                                    <div className="mr-2 cursor-pointer">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Globe
                                                    size={23}
                                                    color="#D3D3D3"
                                                />
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
                                                    disabled={
                                                        language === "ar-AE"
                                                    }
                                                >
                                                    Arabic
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() =>
                                                        setLanguage("zh-CN")
                                                    }
                                                    disabled={
                                                        language === "zh-CN"
                                                    }
                                                >
                                                    Chinese
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() =>
                                                        setLanguage(
                                                            "yue-Hant-HK"
                                                        )
                                                    }
                                                    disabled={
                                                        language ===
                                                        "yue-Hant-HK"
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
                                                    disabled={
                                                        language === "nl-NL"
                                                    }
                                                >
                                                    Dutch
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() =>
                                                        setLanguage("en-US")
                                                    }
                                                    disabled={
                                                        language === "en-US"
                                                    }
                                                >
                                                    English
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() =>
                                                        setLanguage("fr-FR")
                                                    }
                                                    disabled={
                                                        language === "fr-FR"
                                                    }
                                                >
                                                    French
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() =>
                                                        setLanguage("de-DE")
                                                    }
                                                    disabled={
                                                        language === "de-DE"
                                                    }
                                                >
                                                    German
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    onClick={() =>
                                                        setLanguage("it-IT")
                                                    }
                                                    disabled={
                                                        language === "it-IT"
                                                    }
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
                                                    disabled={
                                                        language === "pt-PT"
                                                    }
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
                                                    disabled={
                                                        language === "es-US"
                                                    }
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
                                                    disabled={
                                                        language === "vi-VN"
                                                    }
                                                >
                                                    Vietnamese
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <Textarea
                                        value={secInput}
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
                                        onChange={handleSecInputChange}
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
                            )}

                            {steps.length > 0 ? (
                                <div>
                                    {isLoading ? (
                                        <div
                                            className="flex items-center justify-center bg-white rounded-xl ml-2 
                               shadow-[1px_1px_1px_1px_rgba(0,0,0,0.1)] 
                                transition ease-in-out h-full px-4 py-1"
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
                                transition ease-in-out h-full px-4 py-1"
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
                            ) : (
                                <div className="flex w-full items-center justify-center">
                                    <div
                                        onClick={handleStartProblem}
                                        className="flex px-16 items-center justify-center cursor-pointer bg-white rounded-xl ml-2 
                                shadow-[1px_2px_1px_3px_rgba(0,0,0,0.10)] hover:shadow-[1px_1px_1px_1px_rgba(0,0,0,0.1)] 
                                transition ease-in-out py-1"
                                    >
                                        {solveLoading ? (
                                            <>
                                                <div
                                                    className={`py-3 mr-3 font-outfit ${
                                                        textResult.length == 0
                                                            ? "text-[#c0c0c0]"
                                                            : "text-[#86D20A]"
                                                    }`}
                                                >
                                                    Solving Problem
                                                </div>
                                                <Loader2
                                                    color="#86D20A"
                                                    className="animate-spin "
                                                    size={26}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {processingImg ? (
                                                    <div className="flex flex-row items-center justify-center">
                                                        <div
                                                            className={`py-3 mr-3 font-outfit text-[#c0c0c0]`}
                                                        >
                                                            Processing Image
                                                        </div>
                                                        <Loader2
                                                            color="#c0c0c0"
                                                            className="animate-spin "
                                                            size={26}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-row items-center justify-center">
                                                        <div
                                                            className={`py-3 mr-3 font-outfit ${
                                                                !base64
                                                                    ? "text-[#c0c0c0]"
                                                                    : "text-[#86D20A]"
                                                            }`}
                                                        >
                                                            Start Problem
                                                        </div>
                                                        <Play
                                                            color={
                                                                base64
                                                                    ? "#86D20A"
                                                                    : "#c0c0c0"
                                                            }
                                                            size={26}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                {messages.length > 0 && (
                    <div className=" hidden w-full md:grid md:grid-cols-7 justify-center ">
                        <div></div>

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
                                    Have another problem to work on?
                                    <div
                                        onClick={resetProblem}
                                        className="text-green cursor-pointer flex flex-row items-center hover:-translate-y-[1px] -translate-x-1"
                                    >
                                        Click here!
                                    </div>
                                </h1>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <ImageCropModal
                open={cropModalOpen}
                setOpen={setCropModalOpen}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setCroppedImage={setCroppedImage}
                setBase64={setBase64}
            />
        </div>
    );
}
