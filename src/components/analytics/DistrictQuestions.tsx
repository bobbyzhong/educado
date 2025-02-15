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
import { prisma } from "@/lib/db";
import { Question } from "@prisma/client";

type Props = {
    questions: Question[];
};

const DistrictQuestions = async ({ questions }: Props) => {
    if (questions.length === 0) {
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
                            <TableHead className="w-[50%]">Question</TableHead>
                            <TableHead className="">Answer</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {questions.map((chat: any, index: any) => {
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
export default DistrictQuestions;
