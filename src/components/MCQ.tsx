"use client";
import { CheckIn, Game, Question } from "@prisma/client";
import {
    BarChart,
    ChevronRight,
    ChevronRightIcon,
    Divide,
    Loader2,
    Timer,
} from "lucide-react";
import React, { use } from "react";
import { differenceInSeconds } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { checkAnswerSchema, checkInResponseSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import { cn, formatTimeDelta } from "@/lib/utils";
import Link from "next/link";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "./ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";

type Props = {
    checkIn: CheckIn & {
        questions: Pick<Question, "id" | "options" | "question">[];
    } & { user: any };
};

type Input = z.infer<typeof checkInResponseSchema>;

const MCQ = ({ checkIn }: Props) => {
    const [questionIndex, setQuestionIndex] = React.useState(0);
    const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
    const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
    const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
    const [hasEnded, setHasEnded] = React.useState<boolean>(false);
    const [now, setNow] = React.useState<Date>(new Date());
    const [questionResults, setQuestionResults] = React.useState<any>([]);
    const [studentName, setStudentName] = React.useState<string>("");
    const [attempt, setAttempt] = React.useState<any>();
    const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<Input>({
        resolver: zodResolver(checkInResponseSchema),
        defaultValues: {
            name: "",
        },
    });

    function onSubmit(input: Input) {
        setStudentName(input.name);
    }

    const currentQuestion = React.useMemo(() => {
        return checkIn.questions[questionIndex];
    }, [questionIndex, checkIn.questions]);

    const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
        mutationFn: async () => {
            const payload: z.infer<typeof checkAnswerSchema> = {
                questionId: currentQuestion.id,
                userAnswer: options[selectedChoice],
            };
            const response = await axios.post("/api/checkAnswer", payload);
            return response.data;
        },
    });

    const { mutate: createResult, isLoading } = useMutation({
        mutationFn: async ({
            studentName,
            checkInId,
            questionResults,
        }: any) => {
            // response makes api call to create new game in db and then returns the game id
            const response = await axios.post("/api/submitAttempt", {
                studentName,
                checkInId,
                questionResults,
            });
            return response.data;
        },
    });

    function onSubmitAttempt() {
        createResult(
            {
                studentName: studentName,
                checkInId: checkIn.id,
                questionResults: questionResults,
            },
            {
                onSuccess: ({ resultId }) => {
                    router.push(`/result/${resultId}`);
                },
                onError: () => {
                    console.log("Could not generate");
                },
            }
        );
    }

    const handleNext = React.useCallback(() => {
        if (isChecking) return;

        let questionResult = {
            currentQuestion: currentQuestion.question,
            studentAnswer: "",
            isCorrect: false,
            answer: "",
        };

        checkAnswer(undefined, {
            onSuccess: ({ isCorrect, answer, userAnswer }) => {
                questionResult.answer = answer;
                questionResult.studentAnswer = userAnswer;
                if (isCorrect) {
                    setCorrectAnswers((prev) => prev + 1);
                    questionResult.isCorrect = true;
                } else {
                    setWrongAnswers((prev) => prev + 1);
                    questionResult.isCorrect = false;
                }
                questionResults.push(questionResult);
                console.log(questionResults);

                if (questionIndex === checkIn.questions.length - 1) {
                    setSubmitLoading(true);
                    onSubmitAttempt();
                    return;
                }
                setQuestionIndex((prev) => prev + 1);
            },
        });
    }, [
        checkAnswer,
        toast,
        isChecking,
        questionIndex,
        checkIn.questions.length,
    ]);

    const options = React.useMemo(() => {
        if (!currentQuestion) return [];
        if (!currentQuestion.options) return [];
        return JSON.parse(currentQuestion.options as string) as string[];
    }, [currentQuestion]);

    if (!studentName) {
        return (
            <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-bold text-2xl">
                            Enter your name
                        </CardTitle>
                        <CardDescription>
                            This check-in's title: {checkIn.title} <br />
                            Teacher Name: {checkIn.user.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Smith"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Make sure you put your full name
                                                and have no typos
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button variant={"green"} type="submit">
                                    Continue
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col justify-center mb-1 gap-2">
                    {/* Topic */}
                    <p>
                        <span className="bg-green px-2 py-1  rounded-lg text-white1 mr-2 ">
                            Check-In Title:
                        </span>
                        <span className="  text-zinc-700">{checkIn.title}</span>
                    </p>
                    <p>
                        <span className="bg-green px-2 py-1   rounded-lg text-white1 mr-2 ">
                            Topic:
                        </span>
                        <span className="  text-zinc-700">{checkIn.topic}</span>
                    </p>
                </div>
            </div>

            <Card className="w-full mt-3">
                <CardHeader className="flex flex-row items-center">
                    <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
                        <div>{questionIndex + 1}</div>
                        <div className="text-base text-slate-400">
                            {checkIn.questions.length}
                        </div>
                    </CardTitle>
                    <CardDescription className="flex-grow text-lg select-none">
                        {currentQuestion.question}
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="flex flex-col items-center justify-center w-full mt-4">
                {options.map((option, index) => {
                    return (
                        <Button
                            className="justify-start w-full py-8 mb-4 "
                            key={index}
                            variant={
                                selectedChoice === index
                                    ? "selected"
                                    : "secondary"
                            }
                            onClick={() => {
                                setSelectedChoice(index);
                            }}
                        >
                            <div className="flex items-center justify-center">
                                <div className="p-2 px-3 mr-5 border rounded-md">
                                    {index + 1}
                                </div>
                                <div className="text-start">{option}</div>
                            </div>
                        </Button>
                    );
                })}
                {!submitLoading ? (
                    <Button
                        variant="green"
                        className="mt-2"
                        size="lg"
                        disabled={isChecking}
                        onClick={handleNext}
                    >
                        {isChecking && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <div>Submitting...</div>
                )}
            </div>
        </div>
    );
};
export default MCQ;
