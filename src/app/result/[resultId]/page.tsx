import { prisma } from "@/lib/db";
import {
    ArrowRight,
    ClipboardSignature,
    LucideLayoutDashboard,
} from "lucide-react";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";

import ResultsCard from "@/components/statistics/ResultsCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReviewList from "@/components/review/ReviewList";
import ResultsTable from "@/components/ResultsTable";

type Props = {
    params: {
        resultId: string;
    };
};
const ResultPage = async ({ params: { resultId } }: Props) => {
    const result = await prisma.result.findUnique({
        where: { id: resultId },
    });
    if (!result) {
        return redirect("/new-check-in");
    }

    return (
        <>
            <div className="p-8 mx-auto max-w-7xl">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="mr-2 text-[28px] font-medium tracking-tight">
                            Results for{" "}
                            <span className="font-bold tracking-tight">
                                {result.studentName}
                            </span>
                        </h2>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                        <div className="font-light text-sm mr-3">
                            Finished Reviewing?
                        </div>
                        <Link
                            className={`"mt-8 mr-0 bg-green inline-block text-center max-w-fit text-sm 
                    box-content hover:scale-[1.01] rounded-[5px] px-[20px] my-0 py-[10px] `}
                            href={`/`}
                        >
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-white1 font-semibold">
                                    Share Check-In
                                </div>

                                <Image
                                    src={"/icons/whitearrow.svg"}
                                    height={20}
                                    width={20}
                                    alt={""}
                                />
                            </div>
                        </Link>
                    </div> */}
                </div>

                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    <Card className=" hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                        <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                            <CardTitle className="text-[19px] font-bold tracking-tight">
                                Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between p-0">
                            <p className="  leading-6 w-[98%]">
                                {result.score}%
                            </p>
                        </CardContent>
                    </Card>
                    {/* <Card className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                        <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                            <CardTitle className="text-[19px] font-bold tracking-tight">
                                Topic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between p-0">
                            <p className="  leading-6 w-[98%]">3</p>
                        </CardContent>
                    </Card> */}
                </div>

                <ResultsTable questionResults={result.questionResults} />
            </div>
        </>
    );
};
export default ResultPage;
// [
//     {
//         isCorrect: true,
//         studentAnswer: "Plymouth",
//         currentQuestion: "Which colony was founded by the Pilgrims in 1620?",
//     },
//     {
//         isCorrect: false,
//         studentAnswer: "New York",
//         currentQuestion:
//             "Which colony was known as the 'Breadbasket' due to its agricultural productivity?",
//     },
//     {
//         isCorrect: true,
//         studentAnswer: "Georgia",
//         currentQuestion:
//             "Which colony was the last of the 13 colonies to be founded?",
//     },
// ];
