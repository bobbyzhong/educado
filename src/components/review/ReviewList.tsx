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
import EditQuestionModal from "../EditQuestionModal";
import { PlusIcon, RefreshCcw, RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import AddQuestionModal from "../AddQuestionModal";
import { useRouter } from "next/navigation";
type Props = {
    questions: Question[];
    checkInId: string;
};

const ReviewList = ({ questions, checkInId }: Props) => {
    const router = useRouter();
    const [addQuestionModal, setAddQuestionModal] = React.useState(false);
    const [modalVisibility, setModalVisibility] = React.useState<
        Record<string, boolean>
    >({});

    const handleRefresh = () => {
        router.refresh();
    };

    const openModal = (id: string) => {
        setModalVisibility((prevState) => ({ ...prevState, [id]: true }));
    };

    const closeModal = (id: string) => {
        setModalVisibility((prevState) => ({ ...prevState, [id]: false }));
    };

    return (
        <div>
            <div className="flex flex-row w-full gap-2">
                <Button
                    size={"square"}
                    variant={"green"}
                    onClick={handleRefresh}
                >
                    <RotateCw strokeWidth={2} size={22} />
                </Button>
                <Button
                    onClick={() => {
                        setAddQuestionModal(true);
                    }}
                    size={"md"}
                    variant={"green"}
                >
                    <PlusIcon size={18} className="mr-1" /> Add Question
                </Button>
            </div>

            <Table className="mt-4">
                <TableCaption>End of list.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[10px]">No.</TableHead>
                        <TableHead>Question & Correct Answer</TableHead>
                        <TableHead>All Options</TableHead>
                        <TableHead>Edit</TableHead>

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
                                    id,
                                    answer,
                                    question,
                                    options,
                                    userAnswer,
                                    percentageCorrect,
                                    isCorrect,
                                }: {
                                    id: any;
                                    answer: any;
                                    question: any;
                                    options: any;
                                    userAnswer: any;
                                    percentageCorrect: any;
                                    isCorrect: any;
                                },
                                index
                            ) => {
                                // console.log(options);
                                options = JSON.parse(options);
                                return (
                                    <TableRow key={index}>
                                        <EditQuestionModal
                                            questionId={id}
                                            answer={answer}
                                            question={question}
                                            options={options}
                                            isVisible={
                                                modalVisibility[id] || false
                                            }
                                            onClose={() => {
                                                closeModal(id);
                                            }}
                                        />
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
                                            <TableCell
                                                className={`font-semibold`}
                                            >
                                                {userAnswer}
                                            </TableCell>
                                        ) : (
                                            <TableCell className={""}>
                                                {options[0]}, {options[1]},
                                                {options[2]}, {options[3]}
                                            </TableCell>
                                        )}

                                        <TableCell
                                            onClick={() => {
                                                openModal(id);
                                            }}
                                            className="cursor-pointer text-green underline font-semibold"
                                        >
                                            Edit
                                        </TableCell>
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

            <AddQuestionModal
                isVisible={addQuestionModal}
                onClose={() => {
                    setAddQuestionModal(false);
                }}
                checkInId={checkInId}
            />
        </div>
    );
};

export default ReviewList;
