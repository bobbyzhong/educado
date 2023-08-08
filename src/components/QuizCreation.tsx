"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { Progress } from "./ui/progress";

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const { mutate: getQuestions, isLoading } = useMutation({
        mutationFn: async ({ amount, topic, type }: Input) => {
            // response makes api call to create new game in db and then returns the game id
            const response = await axios.post("/api/game", {
                amount,
                topic,
                type,
            });
            return response.data;
        },
    });

    const router = useRouter();

    const form = useForm<Input>({
        resolver: zodResolver(quizCreationSchema),
        defaultValues: {
            amount: 3,
            topic: "",
            type: "open_ended",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);
        getQuestions(
            {
                amount: input.amount,
                topic: input.topic,
                type: input.type,
            },
            {
                onSuccess: ({ gameId }) => {
                    if (form.getValues("type") == "open_ended") {
                        router.push(`/play/open-ended/${gameId}`);
                    } else {
                        router.push(`/play/mcq/${gameId}`);
                    }
                },
                onError: () => {
                    console.log("Could not generate");
                },
            }
        );
    }

    form.watch();

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-bold text-2xl">
                        Quiz Creation
                    </CardTitle>
                    <CardDescription>Choose a topic</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter a topic..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Please provide a topic
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Number of Questions
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter an amount"
                                                {...field}
                                                type="number"
                                                min={1}
                                                max={10}
                                                onChange={(e) => {
                                                    form.setValue(
                                                        "amount",
                                                        parseInt(e.target.value)
                                                    );
                                                }}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        form.setValue("type", "mcq");
                                    }}
                                    className="w-1/2 rounded-none rounded-l-lg"
                                    variant={
                                        form.getValues("type") === "mcq"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    <CopyCheck className="w-4 h-4 mr-2" />{" "}
                                    Multiple Choice
                                </Button>
                                <Separator orientation="vertical" />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        form.setValue("type", "open_ended");
                                    }}
                                    className="w-1/2 rounded-none rounded-r-lg"
                                    variant={
                                        form.getValues("type") === "open_ended"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    <BookOpen className="w-4 h-4 mr-2" /> Open
                                    Ended
                                </Button>
                            </div>
                            <Button disabled={isLoading} type="submit">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            {showLoader && (
                <div className="w-full flex flex-col items-center mt-5 justify-center ">
                    <h1>Generating Quiz...</h1>
                    <p>This might take 15-30 seconds</p>
                </div>
            )}
        </div>
    );
};
export default QuizCreation;
