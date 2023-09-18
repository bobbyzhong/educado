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
import Link from "next/link";

type Props = { uploadedContent: string };

type Input = z.infer<typeof customCheckInSchema>;

// TO DO:
// -Email western teacher about demo
// -Finished custom check-in
// Create content upload to pinecone

const CustomCheckIn = ({ uploadedContent }: Props) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const [apiError, setApiError] = React.useState(false);
    const { mutate: getQuestions, isLoading } = useMutation({
        mutationFn: async ({
            title,
            amount,
            content,
            type,
            emphasize,
            standard,
        }: Input) => {
            // response makes api call to create new game in db and then returns the game id
            const response = await axios.post("/api/custom-check-in", {
                title,
                amount,
                content,
                type,
                emphasize,
                standard,
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
            title: "Untitled",
            amount: 3,
            content: "",
            type: "mcq",
            emphasize: "",
            standard: "none",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);

        getQuestions(
            {
                title: input.title,
                amount: input.amount,
                content: input.content,
                type: input.type,
                emphasize: input.emphasize,
                standard: input.standard,
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
                    setApiError(true);

                    console.log("Could not generate");
                },
            }
        );
    }

    form.watch();

    if (!uploadedContent || uploadedContent.length < 2) {
        return (
            <div className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col top-1/2 left-1/2">
                <Card className="mt-8 mb-5 w-full max-w-[30rem]">
                    <CardHeader>
                        <CardTitle className="font-bold text-2xl">
                            Sorry, you don't have any uploaded content
                        </CardTitle>
                        <CardDescription>
                            You can upload your own content by going to the
                            dashboard and clicking the "Content Request" card.
                            You can also just create a check-in based on a topic
                            or school standard by going{" "}
                            <Link
                                className="text-green underline cursor-pointer"
                                href={"/new-check-in"}
                            >
                                here
                            </Link>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    } else {
        return (
            <div className="">
                <div className="absolute -translate-x-1/2 flex items-center justify-center flex-col left-1/2">
                    <Card className="mt-8 mb-5 w-full max-w-[30rem]">
                        <CardHeader>
                            <CardTitle className="font-bold text-2xl">
                                New Custom Check-In
                            </CardTitle>
                            <CardDescription>
                                Enter the name of the content you've uploaded
                                that you want to create a check-in on. Make sure
                                to enter the name of the content exactly as it
                                appears on the left.
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
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Title (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Period 5 Matter/Atoms Check-In"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    This is for your reference
                                                    only. Anything put in here
                                                    will not be used to create
                                                    the check-in.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                                    Enter the name of the
                                                    content exactly as it
                                                    appears on the left
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
                                                    Topics to Emphasize
                                                    (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Impact on women and children, Important figures"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter subtopics from your
                                                    content you want to
                                                    emphasize
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
                                                                    e.target
                                                                        .value
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
                                    <FormField
                                        control={form.control}
                                        name="standard"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Curriculum/Standards
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
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
                                                            Oklahoma Academic
                                                            Standards for
                                                            Science 6th Grade
                                                        </SelectItem>
                                                        <SelectItem value="Oklahoma Academic Standards for Science 7th Grade">
                                                            Oklahoma Academic
                                                            Standards for
                                                            Science 7th Grade
                                                        </SelectItem>

                                                        <SelectItem value="NGSS Middle School Science Standards">
                                                            NGSS Middle School
                                                            Science Standards
                                                        </SelectItem>
                                                        <SelectItem value="NGSS 5th Grade Science Standards">
                                                            NGSS 5th Grade
                                                            Science Standards
                                                        </SelectItem>
                                                        <SelectItem value="NGSS Preferred Integrated, Grade Six - Science (CA Dept of Education)">
                                                            NGSS CA 6th Grade
                                                            Preferred Integrated
                                                        </SelectItem>
                                                        <SelectItem value="NGSS Grade Seven - Science (CA Dept of Education)">
                                                            NGSS CA 7th Grade
                                                            Preferred Integrated
                                                        </SelectItem>
                                                        <SelectItem value="Grade 8 Preferred Integrated Model - Science (CA Dept of Education)">
                                                            NGSS CA 8th Grade
                                                            Preferred Integrated
                                                        </SelectItem>
                                                        <SelectItem value="NGSS, Grade 6 Earth & Space Science - Science">
                                                            NGSS CA 6th Grade -
                                                            Earth & Space
                                                            Science
                                                        </SelectItem>
                                                        <SelectItem value="Discipline Specific Grade 7 Life Sciences - Science (CA Dept of Education)">
                                                            NGSS CA 7th Grade -
                                                            Life Science
                                                        </SelectItem>
                                                        <SelectItem value="CA NGSS Discipline Specific Grade 8 - Science (CA Dept of Education)">
                                                            NGSS CA 8th Grade -
                                                            Physical Science
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Send a request for a
                                                    curriculum or standard if
                                                    you want yours listed
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
                                Really sorry there was an error with the
                                check-in! Due to the high amount of traffic
                                we're receiving, you might need to refresh your
                                page or try again. If it still doesn't work,
                                we're really sorry, the team at Pear is working
                                to fix any bugs.
                            </p>
                        </div>
                    )}
                    {showLoader && (
                        <div className="w-full  flex flex-col items-center justify-center ">
                            <h1>Generating Quiz...</h1>
                            <p>This might take 15-30 seconds</p>
                        </div>
                    )}
                </div>
                <ScrollArea className="min-h-[50vh] w-[21%] rounded-lg border  translate-x-[20%] translate-y-[30%]">
                    <div className="p-4">
                        <div className="mb-4 font-medium leading-none">
                            Your Uploaded Content
                        </div>
                        {uploadedContent?.split(",").map((content) => {
                            return (
                                <>
                                    <div className="text-sm">
                                        {content.trim()}
                                    </div>
                                    <Separator className="my-2" />
                                </>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        );
    }
};
export default CustomCheckIn;
