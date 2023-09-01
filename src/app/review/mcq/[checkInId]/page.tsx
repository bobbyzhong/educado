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

type Props = {
    params: {
        checkInId: string;
    };
};
const ReviewPage = async ({ params: { checkInId } }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/");
    }

    const checkIn = await prisma.checkIn.findUnique({
        where: { id: checkInId },
        include: { questions: true },
    });
    if (!checkIn) {
        return redirect("/dashboard");
    }

    return (
        <>
            <div className="p-8 mx-auto max-w-7xl">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                            Review
                        </h2>
                        <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 w-9/12">
                            Below you’ll be able to review the check-in
                            questions and answers and make any changes you want
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="font-light text-sm mr-3">
                            Finished Reviewing?
                        </div>
                        <Link
                            className={`"mt-8 mr-0 bg-green inline-block text-center max-w-fit text-sm 
                    box-content hover:scale-[1.01] rounded-[5px] px-[20px] my-0 py-[10px] `}
                            href={`/share/mcq/${checkInId}`}
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
                    </div>
                </div>

                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    <Card className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                        <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                            <CardTitle className="text-[19px] font-bold tracking-tight">
                                Topic/Concepts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between p-0">
                            <p className="  leading-6 w-[98%]">
                                {checkIn.topic}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                        <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                            <CardTitle className="text-[19px] font-bold tracking-tight">
                                Number of Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between p-0">
                            <p className="  leading-6 w-[98%]">
                                {checkIn.questions.length}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="text-sm text-zinc-500 mt-3">
                    <b>Note:</b> After each edit you'll need to refresh to see
                    the changes you made
                </div>
                <ReviewList questions={checkIn.questions} />
            </div>
        </>
    );
};
export default ReviewPage;
