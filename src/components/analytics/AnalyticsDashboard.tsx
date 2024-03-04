"use client";
import React, { useEffect, useState } from "react";

import { TutorQuestions } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { ArrowUpRightSquare } from "lucide-react";
import Link from "next/link";

const AnalyticsDashboard = () => {
    const [tutorQuestions, setTutorQuestions] = useState<TutorQuestions[]>([]);
    const [limitQuestions, setLimitQuestions] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);

    const getQuestionCount = async () => {
        const res = await fetch("/api/adminDashboard/find-question-count", {
            method: "GET",
        });
        const data = await res.json();
        setNumberOfQuestions(data.count);
    };

    const getRecentQuestions = async () => {
        const res = await fetch("/api/adminDashboard/find-recent-questions", {
            method: "GET",
        });
        const data = await res.json();
        setTutorQuestions(data.questions);
    };

    const getAllQuestions = async () => {
        const res = await fetch("/api/adminDashboard/find-all-questions", {
            method: "GET",
        });
        const data = await res.json();
        setTutorQuestions(data.questions);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (limitQuestions) {
            getRecentQuestions();
        } else {
            getAllQuestions();
        }
    }, [limitQuestions]);

    useEffect(() => {
        getQuestionCount();
    }, []);

    const handleShowAllQuestions = () => {
        setIsLoading(true);
        setLimitQuestions(false);
    };

    return (
        <div className="w-full">
            <div className="flex items-center mb-5 pl-2 mt-10">
                <div className=" flex flex-col items-center w-full gap-1">
                    <h2 className="mr-2 text-[23px] font-bold tracking-tight text-center ">
                        Recent Questions
                    </h2>
                    <a className="font-bold">
                        Total Number of Questions Asked By Students:{" "}
                        {numberOfQuestions}
                    </a>
                    {/* <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 text-center">
                        Here are some of the recently asked questions for this
                        tutor. View the full history{" "}
                        <Link
                            className="text-green underline  "
                            href={`/questionLogs/district`}
                            //   href={`/questionLogs/district/${districtTutorIds}`}
                            target="_blank"
                        >
                            here
                        </Link>
                    </h1> */}
                    <div className="w-full">
                        {tutorQuestions.length === 0 ? (
                            <div>
                                <Table className="mt-4 w-full">
                                    <TableCaption className="">
                                        No questions asked yet.{" "}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[10px]">
                                                No.
                                            </TableHead>
                                            <TableHead>Date Created</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Question</TableHead>
                                            <TableHead className="">
                                                Answer
                                            </TableHead>
                                            <TableHead>Open Convo</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                </Table>
                            </div>
                        ) : (
                            <div>
                                <Table className="mt-4 w-full">
                                    <TableCaption>
                                        {!limitQuestions && !isLoading ? (
                                            <a>End of list.</a>
                                        ) : (
                                            <Button
                                                variant={"green"}
                                                onClick={handleShowAllQuestions}
                                                className={`${
                                                    isLoading && "animate-pulse"
                                                }`}
                                            >
                                                View All
                                            </Button>
                                        )}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="">
                                            <TableHead className="w-[10px]">
                                                No.
                                            </TableHead>
                                            <TableHead className="w-[20px]">
                                                Date Created
                                            </TableHead>
                                            <TableHead className="">
                                                Student Name
                                            </TableHead>
                                            <TableHead className="w-[40%]">
                                                Question
                                            </TableHead>
                                            <TableHead className="">
                                                Answer
                                            </TableHead>
                                            <TableHead className="w-[8%]">
                                                View Chat
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <>
                                            {tutorQuestions.length > 0 &&
                                                tutorQuestions?.map(
                                                    (
                                                        question: any,
                                                        index: any
                                                    ) => {
                                                        const date = new Date(
                                                            question.date
                                                        ).toLocaleDateString();

                                                        return (
                                                            <TableRow
                                                                key={index}
                                                                className="max-h-2 overflow-y-clip"
                                                            >
                                                                <TableCell className="font-semibold">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {date}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Link
                                                                        href={`/convoLog/${question.userId}`}
                                                                        target="_blank"
                                                                        className="text-green underline cursor-pointer"
                                                                    >
                                                                        {
                                                                            question.studentName
                                                                        }
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell className="font-semibold max-w-[1rem]">
                                                                    <div className=" overflow-x-scroll">
                                                                        {
                                                                            question.question
                                                                        }
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="w-[50%]">
                                                                    <div className="max-h-[6rem] overflow-y-scroll">
                                                                        <ReactMarkdown
                                                                            remarkPlugins={[
                                                                                remarkMath,
                                                                            ]}
                                                                            rehypePlugins={[
                                                                                rehypeKatex,
                                                                            ]}
                                                                        >
                                                                            {
                                                                                question.answer
                                                                            }
                                                                        </ReactMarkdown>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="flex items-center justify-center">
                                                                    <Link
                                                                        href={`/convoLog/${question.userId}`}
                                                                        target="_blank"
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <ArrowUpRightSquare
                                                                            size={
                                                                                26
                                                                            }
                                                                            color={
                                                                                "#7EBA1B"
                                                                            }
                                                                        />
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    }
                                                )}
                                        </>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
