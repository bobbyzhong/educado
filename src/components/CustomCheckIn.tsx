"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import {
    customCheckInSchema,
    quizCreationSchema,
    textbookCheckInSchema,
} from "@/schemas/form/quiz";
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
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";

type Props = { uploadedContent: string };

type Input = z.infer<typeof customCheckInSchema>;

// TO DO:
// -Email western teacher about demo
// -Finished custom check-in
// Create content upload to pinecone

const CustomCheckIn = ({ uploadedContent }: Props) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const { mutate: getQuestions, isLoading } = useMutation({
        mutationFn: async ({ amount, content, type, emphasize }: Input) => {
            // response makes api call to create new game in db and then returns the game id
            const response = await axios.post("/api/custom-check-in", {
                amount,
                content,
                type,
                emphasize,
            });
            console.log("RESPONSE DATA");
            console.log(response.data);
            return response.data;
        },
    });

    const router = useRouter();

    const form = useForm<Input>({
        resolver: zodResolver(customCheckInSchema),
        defaultValues: {
            amount: 3,
            content: "",
            type: "mcq",
            emphasize: "",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);

        getQuestions(
            {
                amount: input.amount,
                content: input.content,
                type: input.type,
                emphasize: input.emphasize,
            },
            {
                onSuccess: ({ checkInId }) => {
                    if (form.getValues("type") == "open_ended") {
                        router.push(`/play/open-ended/${checkInId}`);
                    } else {
                        console.log("FINAL STEP");
                        setShowLoader(false);
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
        <div className="">
            <div className="absolute flex flex-col -translate-x-1/2 mt-8 -translate-y-1/2 top-1/2 left-1/2">
                <Card className=" mb-5 w-full max-w-[30rem]">
                    <CardHeader>
                        <CardTitle className="font-bold text-2xl">
                            New Custom Check-In
                        </CardTitle>
                        <CardDescription>
                            Enter the name of the content you've uploaded that
                            you want to create a check-in on. Make sure to enter
                            the name of the content exactly as it appears on the
                            left.
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
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Content Name(s)
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="French Revolution Slides, Chapter 3 Slides, WWII Website, etc."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter the name of the content
                                                exactly as it appears on the
                                                left
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="emphasize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Topics to Emphasize (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Impact on women and children, Important figures"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter subtopics from your
                                                content you want to emphasize
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
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Number of questions on the
                                                check-in
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
                {showLoader && (
                    <div className="w-full  flex flex-col items-center justify-center ">
                        <h1>Generating Quiz...</h1>
                        <p>This might take 15-30 seconds</p>
                    </div>
                )}
            </div>
            <ScrollArea className="h-[30.5rem] w-[20rem] rounded-lg border  translate-x-[9rem] translate-y-[8.1rem]">
                <div className="p-4">
                    <div className="mb-4 font-medium leading-none">
                        Your Uploaded Content
                    </div>
                    {uploadedContent?.split(",").map((content) => {
                        return (
                            <>
                                <div className="text-sm">{content.trim()}</div>
                                <Separator className="my-2" />
                            </>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};
export default CustomCheckIn;
