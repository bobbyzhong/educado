"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema, textbookCheckInSchema } from "@/schemas/form/quiz";
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

type Input = z.infer<typeof textbookCheckInSchema>;

const TextbookCheckIn = (props: Props) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const [apiError, setApiError] = React.useState(false);
    const { mutate: getQuestions, isLoading } = useMutation({
        mutationFn: async ({
            amount,
            topic,
            type,
            textbook,
            chapters,
        }: Input) => {
            // response makes api call to create new game in db and then returns the game id
            const response = await axios.post("/api/textbook-check-in", {
                amount,
                topic,
                type,
                textbook,
                chapters,
            });
            console.log("RESPONSE DATA");
            console.log(response.data);
            return response.data;
        },
    });

    const router = useRouter();

    const form = useForm<Input>({
        resolver: zodResolver(textbookCheckInSchema),
        defaultValues: {
            amount: 3,
            topic: "",
            type: "mcq",
            textbook: "",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);

        getQuestions(
            {
                amount: input.amount,
                topic: input.topic,
                type: input.type,
                textbook: input.textbook,
                chapters: input.chapters,
            },
            {
                onSuccess: ({ checkInId }) => {
                    if (form.getValues("type") == "open_ended") {
                        router.push(`/play/open-ended/${checkInId}`);
                    } else {
                        console.log("HERE");
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
            <Card className="mt-8 mb-5 w-full max-w-[38rem]">
                <CardHeader>
                    <CardTitle className="font-bold text-2xl">
                        New Textbook Check-In
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
                                name="textbook"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Textbook</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a textbook" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="">
                                                <SelectItem value="The United States Through Industrialism 8th Grade Third Edition">
                                                    The United States Through
                                                    Industrialism 8th Grade
                                                    Third Edition
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select the textbook you want to base
                                            the check-in off of. Contact Bobby
                                            via email or phone if you want to
                                            add a certain textbook!
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chapters"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chapter(s)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="1 or Europeans Colonize North America"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="max-w-md">
                                            Please provide the chapter number or
                                            name from the textbook you want to
                                            base the check-in off of
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic/Concepts</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="French Revolution, Price controls instituted by Revolutionary government"
                                                {...field}
                                            />
                                            {/* <Input
                                                placeholder="Enter a topic..."
                                                {...field}
                                            /> */}
                                        </FormControl>
                                        <FormDescription>
                                            Please provide topics or concepts
                                            you want the check-in to emphasize
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
            {apiError && (
                <div className="w-full flex flex-col items-center mb-5 justify-center ">
                    <h1>Error Generating Check-In</h1>
                    <p className="text-sm text-zinc-500 text-center w-9/12">
                        Really sorry there was an error with the check-in! Due
                        to the high amount of traffic we're receiving, you might
                        need to refresh your page or try again. If it still
                        doesn't work, we're really sorry, the team at Educado is
                        working to fix any bugs.
                    </p>
                </div>
            )}
            {showLoader && (
                <div className="w-full flex flex-col items-center mt-5 justify-center ">
                    <h1>Generating Quiz...</h1>
                    <p>This might take 15-30 seconds</p>
                </div>
            )}
        </div>
    );
};
export default TextbookCheckIn;
