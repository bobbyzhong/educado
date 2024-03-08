"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "ai/react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/components/tutor/useAutosizeTextarea";
import { Expand, Globe, Loader2, Mic, Play, SendHorizonal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { ImageCropModal } from "../ImageCropModal";
import Latex from "react-latex-next";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

type Props = {
    tutorName: string;
    tutorDisplayName: string;
    tutorDescription: string;
    ownerName: string;
    tutorId: string;
    admins: string;
    userId: string;
    studentName: string;
    studentId: string;
    defaultPrompt: string;
    tutorType: string;
    tutorGrade: string;
    isPremium: string;
};

export default function HWChat({
    tutorName,
    tutorDisplayName,
    tutorDescription,
    ownerName,
    tutorId,
    admins,
    userId,
    studentName,
    studentId,
    defaultPrompt,
    tutorType,
    tutorGrade,
    isPremium,
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
    const [base64, setBase64] = useState<any>();
    const [problemContext, setProblemContext] = useState("");
    const [imageError, setImageError] = useState(false);

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
            studentId: studentId,
            userId: userId,
            admins: admins,
            tutorDisplayName: tutorDisplayName,
            tutorType: tutorType,
            homeworkQuestion: textResult,
            steps: steps,
            tutorGrade: tutorGrade,
            isPremium: isPremium,
        },
    });

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, input);

    const handleChangeImage = (e: any) => {
      setImageError(false);
      
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
        setImageError(false);

        {
            /* PRODUCTION ONLY */
        }

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

        if(mathData.error == "Content not found") {
            setImageError(true);
            setProcessingImg(false);
            return;
        }

        setTextResult(mathData.text);

        {
            /* USE THIS FOR TESTING TO AVOID MAKING CALL TO MATHPIX */
        }
        // setTextResult(
        //     "For \\( i=\\sqrt{-1} \\), what is the sum \\( (7+3 i)+(-8+9 i) \\) ?"
        // );

        setSolveLoading(true);
        setProcessingImg(false);
        try {
            {
                /* PRODUCTION ONLY */
            }
            const res = await axios.post("/api/ocrTest", {
                textResult: mathData.text,
                problemContext: problemContext,
            });
            const resObj = JSON.parse(res.data.data);

            // const res = `{
            //     "steps": [
            //         "1. Identify the knowns and unknowns: Knowns are the complex numbers to be added: (7+3i) and (-8+9i). The unknown is the sum of these complex numbers.",
            //         "2. Write down the formula for adding two complex numbers: If we have two complex numbers in the form (a+bi) and (c+di), their sum is (a+c) + (b+d)i.",
            //         "3. Apply the formula to the given complex numbers: For (7+3i) and (-8+9i), a=7, b=3, c=-8, and d=9.",
            //         "4. Calculate the real parts and the imaginary parts separately: Real part: 7 + (-8) = -1, Imaginary part: 3 + 9 = 12.",
            //         "5. Combine the results from step 4: The sum is (-1) + (12)i.",
            //         "6. Simplify the answer (if necessary): In this case, the answer is already in its simplest form, so no further simplification is needed. The final answer is -1 + 12i."
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

            // LOGGING QUESTION
            await fetch(`/api/logTutorQuestion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: `Homework Upload: ${mathData.text}`,
                    studentName: studentName,
                    tutorId: tutorId,
                    userId: userId,
                    answer: "What do you think is the first step to solving this problem?",
                }),
            });
        } catch (e) {
            setSolveLoading(false);
            console.log("ERROR: ", e);
        }
    };

    const handleKeypress = (e: any) => {
        // It's triggers by pressing the enter key

        if (e.keyCode == 13 && !e.shiftKey) {
            // if (messages.length >= 10) {
            //     messages.splice(2, 4);
            // }
            // console.log("MESSAGES LENGTH", messages.length);
            handleSubmit(e);
            setSecInput("");
            setInput("");
            e.preventDefault();
        }
    };

    const onHandleSubmit = async (e: any) => {
        // if (messages.length >= 10) {
        //     messages.splice(2, 4);
        // }
        // console.log("MESSAGES LENGTH", messages.length);
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
        setBase64("");
        setProblemContext("");
    };

    const [isRecording, setIsRecording] = useState(false);
    const [language, setLanguage] = useState("en-US");
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        if (window) {
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
        }
    }, [isRecording, language]);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };
    useEffect(() => {
        setSecInput(transcript);
        setInput(transcript);
    }, [transcript]);

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

    // messages.push({
    //     id: "1",
    //     role: "system",
    //     content: "What do you think the first step to solving this problem is?",
    // });

    // ----------------
    // Tutor Chat Section
    // ----------------
    return (
        <main>
            <div className="w-full flex justify-between items-center flex-col ">
                <div
                    // onScroll={(e) => {
                    //     handleScrollMode(e);
                    // }}
                    className="flex 
                  items-center w-full mb-5 flex-1 flex-col overflow-y-scroll  "
                >
                    <div className="max-w-[50rem] ">
                        <div className="mt-12 md:mt-10 mx-3 flex flex-col items-center justify-center">
                            {messages.length === 0 ? (
                                <div className="flex items-center justify-center flex-col">
                                    <div className="flex w-full items-center justify-center flex-col font-outfit">
                                        <h1 className="text-3xl font-semibold text-center">
                                            Hey, I’m{" "}
                                            <span className="text-green">
                                                {tutorDisplayName}!
                                            </span>
                                        </h1>
                                    </div>
                                    <p className="text-base text-center font-light mt-3 w-[60%] font-outfit ">
                                        {tutorDescription} Upload a picture of a
                                        specific question you need help with!
                                    </p>
                                    <p className="text-base text-center font-light mt-3 w-[70%] text-zinc-400 font-outfit">
                                        *Please note, this feature is still in
                                        beta and is limited in functionality
                                        with graphs and charts. The team at
                                        Educado is working hard to improve it!*
                                    </p>

                                    <Input
                                        className="cursor-pointer mt-3"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChangeImage}
                                    />
                                    <div className="mt-5 p-3 border rounded-md w-full flex flex-col items-center justify-center">
                                        {croppedImage && (
                                            <div className={`${imageError && 'border-4 border-red-600'}`}>
                                                <Image
                                                    src={croppedImage}
                                                    height={500}
                                                    width={500}
                                                    alt=""
                                                />
                                            </div>
                                        )}

                                        {imageError && (
                                          <div className="mt-3 text-red-600">
                                            Math problem not detected. Please try again.
                                          </div>
                                        )}
                                    </div>

                                    {croppedImage && (
                                        <div
                                            className="mt-5 p-3  rounded-md w-full flex items-center justify-center flex-col font-outfit 
                            "
                                        >
                                            <h1 className="mb-3 text-zinc-500">
                                                Enter any additional
                                                instructions here if needed
                                                (optional)
                                            </h1>
                                            <Input
                                                onChange={(e) =>
                                                    setProblemContext(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="I need to factor this expression"
                                            ></Input>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="fixed md:top-[74px] top-[100px] bg-white w-full left-1/2 -translate-x-1/2 md:min-w-full border-b-2 z-[99] py-1">
                                        <div className="grid md:grid-cols-3 grid-cols-1 ">
                                            <div></div>
                                            <PhotoProvider>
                                                <div className="rounded-md w-full flex items-center justify-center flex-row md:h-[7.5rem]">
                                                    <PhotoView
                                                        src={croppedImage}
                                                    >
                                                        <div className="cursor-pointer">
                                                            <Expand
                                                                className="absolute "
                                                                color={
                                                                    "#151515"
                                                                }
                                                            />
                                                            <Image
                                                                src={
                                                                    croppedImage
                                                                }
                                                                height={200}
                                                                width={200}
                                                                alt=""
                                                                className="h-[3.5rem] md:h-[7.5rem] w-full object-contain"
                                                            />
                                                        </div>
                                                    </PhotoView>
                                                </div>
                                            </PhotoProvider>
                                            <div className="flex flex-row items-center justify-center md:justify-end md:pr-10 py-3 md:py-0">
                                                <div
                                                    onClick={resetProblem}
                                                    className="flex px-5 md:px-8 items-center justify-center cursor-pointer bg-white rounded-xl ml-2 
                                shadow-[1px_2px_1px_3px_rgba(0,0,0,0.10)] hover:shadow-[1px_1px_1px_1px_rgba(0,0,0,0.1)] 
                                transition ease-in-out py-1"
                                                >
                                                    <div
                                                        className={`py-2 md:py-3 mr-3 font-outfit text-[#505050]`}
                                                    >
                                                        Next Problem
                                                    </div>
                                                    <Play
                                                        color={"#797979"}
                                                        size={23}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[90px] "></div>
                                    <div className="mt-[2.5rem] md:mt-[1.5rem]">
                                        {messages.length > 0 &&
                                            messages.map((m: any) => (
                                                <div
                                                    key={m.id}
                                                    className="my-3 "
                                                >
                                                    {m.role === "user" ? (
                                                        <div className=" px-5 rounded-lg md:min-w-[48rem] flex flex-row items-start py-5 gap-4">
                                                            <Image
                                                                src={
                                                                    "/userIcon.png"
                                                                }
                                                                height={45}
                                                                width={45}
                                                                alt={"User: "}
                                                                className="object-contain"
                                                            />
                                                            <ReactMarkdown
                                                                className="flex flex-col leading-8 prose"
                                                                remarkPlugins={[
                                                                    remarkMath,
                                                                ]}
                                                                rehypePlugins={[
                                                                    rehypeKatex,
                                                                    rehypeMathjax,
                                                                ]}
                                                            >
                                                                {convertLatexDeliminators(
                                                                    m.content
                                                                )}
                                                            </ReactMarkdown>
                                                        </div>
                                                    ) : (
                                                        <div className=" bg-green3 px-5 md:min-w-[48rem] rounded-lg flex flex-row items-start py-5 gap-4">
                                                            <Image
                                                                src={
                                                                    "/educadoIcon.png"
                                                                }
                                                                height={45}
                                                                width={45}
                                                                alt={"Steve: "}
                                                                className="object-contain "
                                                            />
                                                            <ReactMarkdown
                                                                className="flex flex-col leading-8 prose"
                                                                remarkPlugins={[
                                                                    remarkMath,
                                                                ]}
                                                                rehypePlugins={[
                                                                    rehypeKatex,
                                                                    rehypeMathjax,
                                                                ]}
                                                            >
                                                                {convertLatexDeliminators(
                                                                    m.content
                                                                )}
                                                            </ReactMarkdown>
                                                            {/* <Latex>
                                                                {m.content}
                                                            </Latex> */}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
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
                        className="stretch mx-2 flex flex-col gap-3 last:mb-2 md:mx-4  lg:mx-auto lg:max-w-2xl xl:max-w-3xl -translate-y-6"
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
                                                        disabled={
                                                            language === "cs"
                                                        }
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
                                                        disabled={
                                                            language === "ja"
                                                        }
                                                    >
                                                        Japanese
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        onClick={() =>
                                                            setLanguage("ko")
                                                        }
                                                        disabled={
                                                            language === "ko"
                                                        }
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
                                                        disabled={
                                                            language === "ru"
                                                        }
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
                                                        disabled={
                                                            language === "tr"
                                                        }
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
                                                        secInput.length === 0
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
                                                            textResult.length ==
                                                            0
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
        </main>
    );
}
