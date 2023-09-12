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
    const [apiError, setApiError] = React.useState(false);
    const { mutate: getQuestions, isLoading } = useMutation({
        mutationFn: async ({
            amount,
            topic,
            type,
            context,
            standard,
        }: Input) => {
            // response makes api call to create new game in db and then returns the game id

            const response = await axios.post("/api/check-in", {
                amount,
                topic,
                type,
                context,
                standard,
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
            standard: "none",
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
                standard: input.standard,
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
                    setApiError(true);
                    console.log("Could not generate");
                },
            }
        );
    }

    form.watch();

    return (
        <div className="absolute -translate-x-1/2 flex items-center justify-center flex-col left-1/2">
            <Card className="mt-16 mb-5 w-full max-w-[38rem]">
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
                                name="standard"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Curriculum/Standards
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a curriculum or standard" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    none
                                                </SelectItem>

                                                <SelectItem value="Oklahoma Academic Standards for Science 6th Grade">
                                                    Oklahoma Academic Standards
                                                    for Science 6th Grade
                                                </SelectItem>
                                                <SelectItem value="NGSS Middle School Science Standards">
                                                    NGSS Middle School Science
                                                    Standards
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Send a request for a curriculum or
                                            standard if you want yours listed
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
                                                placeholder="You can put any facts or notes here if you want"
                                                {...field}
                                                rows={3}
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
            {apiError && (
                <div className="w-full flex flex-col items-center mb-5 justify-center ">
                    <h1>Error Generating Check-In</h1>
                    <p className="text-sm text-zinc-500 text-center w-9/12">
                        Please refresh your page and try again. If this problem
                        persists, please contact us.
                    </p>
                </div>
            )}
            {showLoader && (
                <div className="w-full flex flex-col items-center mt-5 mb-5 justify-center ">
                    <h1>Generating Quiz...</h1>
                    <p>This might take 10-15 seconds</p>
                </div>
            )}
        </div>
    );
};
export default TopicCheckIn;
