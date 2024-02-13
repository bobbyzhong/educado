import React from "react";
import DistrictQuestions from "./DistrictQuestions";
import { prisma } from "@/lib/db";
import Link from "next/link";

type Props = {
    district: string | undefined;
};

const AnalyticsDashboard = async ({ district }: Props) => {
    const districtTutors = await prisma.tutor.findMany({
        where: {
            district: district,
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    const districtTutorIds = districtTutors.map((tutor) => tutor.id);
    const numberOfQuestions: number = await prisma.tutorQuestions.count({
        where: {
            tutorId: {
                in: districtTutors.map((tutor) => tutor.id),
            },
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center mb-5 pl-2">
                <div className=" flex flex-col items-center w-full gap-1">
                    <h2 className="mr-2 text-[23px] font-bold tracking-tight text-center ">
                        Student Data
                    </h2>
                    <a className="font-bold">
                        Total Number of Questions Asked By Students:{" "}
                        {numberOfQuestions}
                    </a>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 text-center">
                        Here are some of the recently asked questions for this
                        tutor. View the full history{" "}
                        <Link
                            className="text-green underline  "
                            href={`/chatLogs/district`}
                            //   href={`/chatLogs/district/${districtTutorIds}`}
                            target="_blank"
                        >
                            here
                        </Link>
                    </h1>
                    <div className="w-full">
                        <DistrictQuestions
                            limit={10}
                            tutorIds={districtTutorIds}
                        />
                        <DistrictQuestions
                            limit={10}
                            tutorIds={districtTutorIds}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
