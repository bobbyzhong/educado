import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { LucideLayoutDashboard } from "lucide-react";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ResultsCard from "@/components/statistics/ResultsCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionList";

type Props = {
    params: {
        checkInId: string;
    };
};
const StatisticsPage = async ({ params: { checkInId } }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/");
    }

    const checkIn = await prisma.checkIn.findUnique({
        where: { id: checkInId },
        include: { questions: true },
    });
    if (!checkIn) {
        return redirect("/quiz");
    }

    let accuracy: number = 0;

    if (checkIn.checkInType === "mcq") {
        let totalCorrect = checkIn.questions.reduce((acc: any, question) => {
            if (question.isCorrect) {
                return acc + 1;
            }
            return acc;
        }, 0);
        accuracy = (totalCorrect / checkIn.questions.length) * 100;
    } else if (checkIn.checkInType === "open_ended") {
        let totalPercentage = checkIn.questions.reduce((acc: any, question) => {
            return acc + (question.percentageCorrect || 0);
        }, 0);
        accuracy = totalPercentage / checkIn.questions.length;
    }
    accuracy = Math.round(accuracy * 100) / 100;

    return (
        <>
            <div className="p-8 mx-auto max-w-7xl">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Summary
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Link href="/dashboard" className={buttonVariants()}>
                            <LucideLayoutDashboard className="mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 mt-4 md:grid-cols-7">
                    {/* <ResultsCard accuracy={accuracy} /> */}
                    <AccuracyCard accuracy={accuracy} />
                    <TimeTakenCard
                        timeEnded={new Date(checkIn.timeEnded ?? 0)}
                        timeStarted={new Date(checkIn.timeStarted ?? 0)}
                    />
                </div>
                <QuestionsList questions={checkIn.questions} />
            </div>
        </>
    );
};
export default StatisticsPage;
