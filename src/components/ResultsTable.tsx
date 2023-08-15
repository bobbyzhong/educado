"use client";
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

type Props = { questionResults: any };
const ResultsTable = ({ questionResults }: Props) => {
    return (
        <div>
            <Table className="mt-4">
                <TableCaption>End of list.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[10px]">No.</TableHead>
                        <TableHead>Question & Correct Answer</TableHead>
                        <TableHead>Student Answer</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {questionResults.map(
                            (
                                {
                                    isCorrect,
                                    studentAnswer,
                                    currentQuestion,
                                    answer,
                                }: {
                                    isCorrect: any;
                                    studentAnswer: any;
                                    currentQuestion: any;
                                    answer: any;
                                },
                                index: any
                            ) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {currentQuestion} <br />
                                            <br />
                                            <span className="font-semibold">
                                                {answer}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            className={`${
                                                isCorrect
                                                    ? "text-green"
                                                    : "text-red-600"
                                            } font-semibold`}
                                        >
                                            {studentAnswer}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}
                    </>
                </TableBody>
            </Table>
        </div>
    );
};
export default ResultsTable;
