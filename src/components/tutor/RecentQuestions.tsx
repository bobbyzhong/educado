import React from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Result } from "@prisma/client";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowUpRightSquare } from "lucide-react";

type Props = { limit: number; tutorId: string };

// I want to change TutorQuestion instead of chats
const RecentQuestions = async ({ limit, tutorId }: Props) => {
    let chats = await prisma.tutorQuestions.findMany({
        take: limit,
        where: {
            tutorId: tutorId,
        },
        orderBy: {
            date: "desc",
        },
    });

    if (chats.length === 0) {
        return (
            <div>
                <Table className="mt-4 w-full">
                    <TableCaption className="">
                        No questions asked yet.{" "}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[10px]">No.</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead className="">Answer</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
        );
    } else {
        return (
            <div>
                <Table className="mt-4 w-full">
                    <TableCaption>End of list.</TableCaption>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[10px]">No.</TableHead>
                            <TableHead className="w-[20px]">
                                Date Created
                            </TableHead>
                            <TableHead className="">Student Name</TableHead>
                            <TableHead className="w-[40%]">Question</TableHead>
                            <TableHead className="">Answer</TableHead>
                            <TableHead className="w-[8%]">View Chat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {chats.map((chat: any, index: any) => {
                                const date = new Date(
                                    chat.date
                                ).toLocaleDateString();

                                return (
                                    <TableRow
                                        key={index}
                                        className="max-h-2 overflow-y-clip"
                                    >
                                        <TableCell className="font-semibold">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{date}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/convoLog/${chat.userId}`}
                                                target="_blank"
                                                className="text-green underline cursor-pointer"
                                            >
                                                {chat.studentName}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="font-semibold max-w-[1rem]">
                                            <div className=" overflow-x-scroll">
                                                {chat.question}
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-[50%]">
                                            <div className="max-h-[6rem] overflow-y-scroll">
                                                {chat.answer}
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex items-center justify-center">
                                            <Link
                                                href={`/convoLog/${chat.userId}`}
                                                target="_blank"
                                                className="cursor-pointer"
                                            >
                                                <ArrowUpRightSquare
                                                    size={26}
                                                    color={"#7EBA1B"}
                                                />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    </TableBody>
                </Table>
            </div>
        );
    }
};
export default RecentQuestions;
