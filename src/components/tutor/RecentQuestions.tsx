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
                <Table className="mt-4">
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
                <Table className="mt-4">
                    <TableCaption>End of list.</TableCaption>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[10px]">No.</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead className="">Answer</TableHead>
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
                                            {chat.studentName}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {chat.question}
                                        </TableCell>
                                        <TableCell className="w-[40%]">
                                            <div className="max-h-[5rem] overflow-y-scroll">
                                                {chat.answer}
                                            </div>
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
