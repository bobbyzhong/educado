import { prisma } from "@/lib/db";
import { Info } from "lucide-react";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import CopyCard from "@/components/share/CopyCard";
import QrCodeCard from "@/components/share/QrCodeCard";
import CodeDisplay from "@/components/CodeDisplay";

import TutorContentCard from "@/components/tutor/TutorContentCard";
import RecentQuestions from "@/components/tutor/RecentQuestions";

type Props = {
    params: {
        id: string;
    };
};
const ViewEditTutor = async ({ params: { id } }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/");
    }
    const tutor = await prisma.tutor.findUnique({
        where: {
            id: id,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user?.isTeacher) {
        redirect("/dashboard-student");
    }

    const link = `${process.env.API_URL}/tutor/${id}`;

    let contentList: any[] = [];
    if (tutor?.uploadedContent !== null) {
        const retrievedList = tutor?.uploadedContent.split(",");
        contentList = retrievedList!;
    }

    return (
        <>
            <div>
                <div className="p-8 mx-auto max-w-5xl">
                    <div className="flex w-full justify-center mt-3 text-center">
                        <div className="flex flex-row items-center justify-center gap-3">
                            <h1 className=" text-[#C5C5C5] font-extrabold tracking-tight text-lg">
                                TUTOR NAME{" "}
                                <div className="text-3xl font-[600] tracking-tight text-green">
                                    {tutor?.tutorDisplayName}
                                </div>
                            </h1>
                            <div className="text-5xl text-[#C5C5C5] font-extralight">
                                |
                            </div>
                            <CodeDisplay code={tutor?.joinCode!} />
                        </div>
                    </div>
                    <div className="w-full flex justify-center text-center">
                        <h1 className="text-base text-zinc-500 w-full md:w-7/12 flex flex-row gap-1 items-center justify-center  leading-[1] mt-3 ">
                            <Info size={20} color="grey" />
                            <span className="text-base">
                                {" "}
                                {tutor?.tutorDescription}
                            </span>
                        </h1>
                    </div>
                    <div className="grid gap-4 mt-5 md:grid-cols-3">
                        <TutorContentCard
                            teacherName={tutor!.ownerName!}
                            tutorName={tutor!.tutorName}
                        />
                        <CopyCard link={link} />
                        <QrCodeCard link={link} />
                    </div>
                    <div className="flex items-center justify-center text-center mb-5 mt-10">
                        <div className=" flex flex-col gap-1 w-full items-center ">
                            <h2 className="mr-2 text-[23px] font-bold tracking-tight ">
                                Uploaded Content
                            </h2>

                            <h1 className="text-zinc-500 text-[15px] w-10/12 md:w-8/12 dark:text-zinc-300 mb-5 ">
                                This is the content that your tutor is trained
                                on. Your tutor will respond to your students'
                                questions based on this content.
                            </h1>

                            {contentList.length > 0 ? (
                                <div className="flex flex-row gap-3 flex-wrap justify-center">
                                    {contentList.map((content, i) => {
                                        return (
                                            <div
                                                className="bg-green shrink-0 text-white1 px-3 py-1 rounded-full"
                                                key={i}
                                            >
                                                {content}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <h1 className="text-zinc-500 text-[15px] w-10/12 dark:text-zinc-300 mb-5 ">
                                    No content uploaded yet! Upload some content
                                    above.
                                </h1>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center mb-5  pl-2">
                    <div className=" flex flex-col items-center w-full gap-1">
                        <h2 className="mr-2 text-[23px] font-bold tracking-tight text-center ">
                            Student Data
                        </h2>
                        <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 text-center">
                            Here are some of the recently asked questions for
                            this tutor. View the full history{" "}
                            <Link
                                className="text-green underline  "
                                href={`/chatLogs/${tutor?.id}`}
                                target="_blank"
                            >
                                here
                            </Link>
                        </h1>
                        <div className="w-full ">
                            <RecentQuestions limit={10} tutorId={tutor!.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ViewEditTutor;
