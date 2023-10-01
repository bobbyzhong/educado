import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { EyeIcon, LucideLayoutDashboard, QrCodeIcon } from "lucide-react";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CopyCard from "@/components/share/CopyCard";
import QrCodeCard from "@/components/share/QrCodeCard";
import CodeDisplay from "@/components/CodeDisplay";
import TutorCodeDisplay from "@/components/educadoTutor/TutorCodeDisplay";
import ContentRequestCard from "@/components/dashboard/ContentRequestCard";
import TutorContentCard from "@/components/tutor/TutorContentCard";

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

    const link = `${process.env.API_URL}/tutor/${id}`;
    console.log(link);

    let contentList: any[] = [];
    if (tutor?.uploadedContent !== null) {
        const retrievedList = tutor?.uploadedContent.split(",");
        contentList = retrievedList!;
    }

    return (
        <>
            <div className="p-8 mx-auto max-w-5xl">
                <div className="flex items-start justify-between mt-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl text-zinc-500">
                            Tutor Name:{" "}
                            <span className="text-3xl font-bold tracking-tight text-green">
                                {tutor?.tutorDisplayName}
                            </span>
                        </h1>
                        <CodeDisplay code={tutor?.joinCode!} />
                    </div>

                    <div className="flex items-start justify-start space-x-2">
                        <Link
                            href="/dashboard"
                            className={buttonVariants({ variant: "green" })}
                        >
                            <LucideLayoutDashboard className="mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
                <h1 className="text-base text-zinc-600 w-11/12 leading-[1] mt-3">
                    Description:{" "}
                    <span className="text-base">
                        {" "}
                        {tutor?.tutorDescription}
                    </span>
                </h1>
                <div className="grid gap-4 mt-5 md:grid-cols-3">
                    <TutorContentCard
                        teacherName={tutor!.ownerName!}
                        tutorName={tutor!.tutorName}
                    />
                    <CopyCard link={link} />
                    <QrCodeCard link={link} />
                </div>
                <div className="flex items-center mb-5 mt-10">
                    <div className=" flex flex-col gap-1">
                        <h2 className="mr-2 text-[26px] font-semibold tracking-tight ">
                            Uploaded Content
                        </h2>
                        <h1 className="text-zinc-500 text-[15px] w-10/12 dark:text-zinc-300 mb-5 ">
                            This is the content that your tutor is trained on.
                            Your tutor will respond to your students' questions
                            based on this content.
                        </h1>
                        {contentList.length > 0 ? (
                            <div className="flex flex-row gap-3 flex-wrap">
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
                <div className="flex items-center mb-5 mt-10">
                    <div className=" flex flex-col gap-1">
                        <h2 className="mr-2 text-[26px] font-semibold tracking-tight ">
                            Student Data
                        </h2>
                        <h1 className="text-zinc-500 text-[15px] w-10/12 dark:text-zinc-300 mb-5 ">
                            Coming soon! Here you'll be able to see things like
                            commonly asked questions, most active students, and
                            more!
                        </h1>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ViewEditTutor;
