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
import { Question } from "@prisma/client";
type Props = {
    questions: Question[];
};

const ReviewList = ({ questions }: Props) => {
    return (
        <Table className="mt-4">
            <TableCaption>End of list.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[10px]">No.</TableHead>
                    <TableHead>Question & Correct Answer</TableHead>
                    <TableHead>All Options</TableHead>

                    {questions[0].questionType === "open_ended" && (
                        <TableHead className="w-[10px] text-right">
                            Accuracy
                        </TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                <>
                    {questions.map(
                        (
                            {
                                answer,
                                question,
                                options,
                                userAnswer,
                                percentageCorrect,
                                isCorrect,
                            }: {
                                answer: any;
                                question: any;
                                options: any;
                                userAnswer: any;
                                percentageCorrect: any;
                                isCorrect: any;
                            },
                            index
                        ) => {
                            options = JSON.parse(options);
                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {question} <br />
                                        <br />
                                        <span className="font-semibold">
                                            {answer}
                                        </span>
                                    </TableCell>

                                    {questions[0].questionType ===
                                    "open_ended" ? (
                                        <TableCell className={`font-semibold`}>
                                            {userAnswer}
                                        </TableCell>
                                    ) : (
                                        <TableCell className={""}>
                                            {options[0]}, {options[1]},
                                            {options[2]}, {options[3]}
                                        </TableCell>
                                    )}

                                    {percentageCorrect && (
                                        <TableCell className="text-right">
                                            {percentageCorrect}%
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        }
                    )}
                </>
            </TableBody>
        </Table>
    );
};

export default ReviewList;
