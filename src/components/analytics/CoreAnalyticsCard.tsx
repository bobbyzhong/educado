"use client";
import React, { useEffect, useState } from "react";

import { TutorQuestions } from "@prisma/client";

import { Info } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

const CoreAnalyticsCard = () => {
    const [tutorQuestions, setTutorQuestions] = useState<TutorQuestions[]>([]);
    const [limitQuestions, setLimitQuestions] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
    const [activeStudents, setActiveStudents] = useState<number>(0);
    const [questionsThisWeek, setQuestionsThisWeek] = useState<number>(0);

    const getQuestionCount = async () => {
        const res = await fetch("/api/adminDashboard/find-question-count", {
            method: "GET",
        });
        const data = await res.json();
        setNumberOfQuestions(data.count);
    };

    const getActiveStudents = async () => {
        const res = await fetch("/api/adminDashboard/find-active-students", {
            method: "GET",
        });
        const data = await res.json();
        setActiveStudents(data.activeStudentCount);
        setQuestionsThisWeek(data.questionsThisWeek);
    };

    useEffect(() => {
        getQuestionCount();
        getActiveStudents();
    }, []);

    return (
        <div className="w-[70%]">
            <div className="border rounded-lg p-5 px-7 flex flex-col">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-700 mb-8">
                    Core Analytics
                </h1>
                <div className="flex flex-col md:flex-row justify-between">
                    <div>
                        <div className="flex flex-row items-center gap-3">
                            <h1 className="text-sm font-semibold tracking-tight text-zinc-500">
                                Total Questions Asked
                            </h1>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info color={"#727272"} size={17} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            This is the total number of
                                            questions asked to your homework
                                            helpers
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        {numberOfQuestions && (
                            <h1 className="text-2xl font-semibold tracking-tight text-zinc-700 mt-2 ml-1">
                                {numberOfQuestions}
                            </h1>
                        )}
                    </div>
                    <div className="text-zinc-300 text-5xl font-[200] md:block hidden">
                        |
                    </div>
                    <div>
                        <div className="flex flex-row items-center gap-3">
                            <h1 className="text-sm font-semibold tracking-tight text-zinc-500">
                                Active Students This Week
                            </h1>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info color={"#727272"} size={17} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            This is the number of students from
                                            your district who have asked a
                                            question in the past week
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-700 mt-2 ml-1">
                            {activeStudents}
                        </h1>
                    </div>
                    <div className="text-zinc-300 text-5xl font-[200] md:block hidden">
                        |
                    </div>
                    <div>
                        <div className="flex flex-row items-center gap-3">
                            <h1 className="text-sm font-semibold tracking-tight text-zinc-500">
                                Questions This Week
                            </h1>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info color={"#727272"} size={17} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            This is the number of questions that
                                            have been asked in the past week
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-700 mt-2 ml-1">
                            {questionsThisWeek}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoreAnalyticsCard;
