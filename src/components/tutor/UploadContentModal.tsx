"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import {
    contentRequestSchema,
    tutorContentRequestSchema,
} from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "../ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { LucideLayoutDashboard, X } from "lucide-react";

type Input = z.infer<typeof tutorContentRequestSchema>;

export const UploadContentModal = ({
    isVisible,
    onClose,
    teacherName,
    tutorName,
}: {
    isVisible: any;
    onClose: any;
    teacherName: string;
    tutorName: string;
}) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    const [showLoader, setShowLoader] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    const { mutate: submitRequest, isLoading } = useMutation({
        mutationFn: async ({ content, tutorName, teacherName }: Input) => {
            const response = await axios.post("/api/tutorContentRequest", {
                content,
                tutorName,
                teacherName,
            });
            console.log("RESPONSE DATA");
            console.log(response.data);
            return response.data;
        },
    });

    const form = useForm<Input>({
        resolver: zodResolver(contentRequestSchema),
        defaultValues: {
            content: "",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);
        submitRequest(
            {
                content: input.content,
                tutorName: tutorName,
                teacherName: teacherName,
            },
            {
                onSuccess: () => {
                    setSent(true);
                },
                onError: () => {
                    setShowLoader(false);
                    console.log("Could not generate");
                },
            }
        );
    }

    form.watch();

    if (sent) {
        return (
            <div
                className="z-[60] fixed  inset-0 bg-black bg-opacity-25 backdrop-blur-sm
        flex justify-center items-center"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className="flex flex-col items-end">
                        <Card className="w-[30rem]">
                            <CardHeader>
                                <CardTitle className="font-semibold text-[21px] flex flex-row justify-between">
                                    Request Sent!{" "}
                                    <X onClick={onClose} cursor={"pointer"} />
                                </CardTitle>

                                <CardDescription className="text-[16px] ">
                                    Your tutor will be updated as soon as
                                    possible. It should be ready within an hour
                                    or so for your students to ask questions
                                    about the latest content.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div
                className="z-[60] fixed  inset-0 bg-black bg-opacity-25 backdrop-blur-sm
        flex justify-center items-center"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[500px] flex rounded-md flex-col bg-white1 py-6 px-8 mb-5">
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <Card className="max-w-[38rem]">
                            <CardHeader>
                                <CardTitle className="font-bold text-2xl flex flex-row justify-between">
                                    Upload Content{" "}
                                    <X onClick={onClose} cursor={"pointer"} />
                                </CardTitle>
                                <CardDescription>
                                    Enter the name of the content you want the
                                    tutor to know. This can be a textbook
                                    chapter, school standards, lecture slides,
                                    syllabus, or anything else your students
                                    might have questions about.
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
                                                        Content
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="NGSS Standards, 
                                                            Chapter 1 of *Textbook Name*, 
                                                            *Link to lecture slides*"
                                                            {...field}
                                                            rows={5}
                                                        />
                                                    </FormControl>

                                                    <FormDescription>
                                                        Make sure any links or
                                                        titles are spelt
                                                        correctly
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
                    </div>
                </div>
            </div>
        );
    }
};
