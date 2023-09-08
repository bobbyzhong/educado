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
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const TopicCheckIn = (props: Props) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const { mutate: getQuestions, isLoading } = useMutation({
        mutationFn: async ({ amount, topic, type, context }: Input) => {
            // response makes api call to create new game in db and then returns the game id
            const response = await axios.post("/api/check-in", {
                amount,
                topic,
                type,
                context,
            });
            console.log("RESPONSE DATA");
            console.log(response.data);
            return response.data;
        },
    });

    const router = useRouter();

    const form = useForm<Input>({
        resolver: zodResolver(quizCreationSchema),
        defaultValues: {
            amount: 3,
            topic: "",
            type: "mcq",
            context: "",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);
        getQuestions(
            {
                amount: input.amount,
                topic: input.topic,
                type: input.type,
                context: input.context,
            },
            {
                onSuccess: ({ checkInId }) => {
                    if (form.getValues("type") == "open_ended") {
                        router.push(`/play/open-ended/${checkInId}`);
                    } else {
                        router.push(`/review/mcq/${checkInId}`);
                    }
                },
                onError: () => {
                    setShowLoader(false);
                    console.log("Could not generate");
                },
            }
        );
    }

    form.watch();

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Card className="mt-48 mb-5 w-full max-w-[38rem]">
                <CardHeader>
                    <CardTitle className="font-bold text-2xl">
                        New Check-In
                    </CardTitle>
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
                                        <FormLabel>Topic/Concepts</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="French Revolution, Price controls institutded by Revolutionary government"
                                                {...field}
                                            />
                                            {/* <Input
                                                placeholder="Enter a topic..."
                                                {...field}
                                            /> */}
                                        </FormControl>
                                        <FormDescription>
                                            Please provide a topic or concept to
                                            base the check-in on. Make sure to
                                            put specific topics or concepts if
                                            you want the check-in to be focused
                                            on a specific topic.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="context"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Context (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="The Estates-General met at Versailles on May 5, 1789. They were immediately divided over a fundamental issue: should they vote by head, giving the advantage to the Third Estate, or by estate, in which case the two privileged orders of the realm might outvote the third? On June 17 the bitter struggle over this legal issue finally drove the deputies of the Third Estate to declare themselves the National Assembly;"
                                                {...field}
                                                rows={6}
                                            />
                                            {/* <Input
                                                placeholder="Enter a topic..."
                                                {...field}
                                            /> */}
                                        </FormControl>
                                        <FormDescription>
                                            Put any context you want your
                                            check-in to have. The content put
                                            here will be the content that the
                                            check-in is based on.
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
                                        <FormDescription>
                                            Number of questions on the check-in
                                        </FormDescription>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>
                                    Curriculum/Standards {"("}Coming Soon{")"}
                                </FormLabel>
                                <Select>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a curriculum or standard" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="m@example.com">
                                            Coming Soon!
                                        </SelectItem>
                                        <SelectItem value="m@google.com">
                                            Coming Soon!
                                        </SelectItem>
                                        <SelectItem value="m@support.com">
                                            Coming Soon!
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Standards from Cal Dept. of Ed are coming
                                    soon!
                                </FormDescription>
                                <FormMessage />
                            </FormItem>

                            <Button
                                variant={"green"}
                                disabled={isLoading}
                                type="submit"
                            >
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
export default TopicCheckIn;
