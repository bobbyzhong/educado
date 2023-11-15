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
    createTutorRequestSchema,
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

type Input = z.infer<typeof createTutorRequestSchema>;

export const CreateTutorModal = ({
    isVisible,
    onClose,
    userId,
}: {
    isVisible: any;
    onClose: any;
    userId: string;
}) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    const [showLoader, setShowLoader] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    const { mutate: submitRequest, isLoading } = useMutation({
        mutationFn: async ({
            teacherName,
            chosenName,
            description,
            desiredContent,
            files,
        }: Input) => {
            const response = await axios.post("/api/newTutorRequest", {
                teacherName,
                chosenName,
                description,
                userId,
                desiredContent,
                files,
            });
            console.log("RESPONSE DATA");
            console.log(response.data);
            return response.data;
        },
    });

    const form = useForm<Input>({
        resolver: zodResolver(createTutorRequestSchema),
        defaultValues: {
            teacherName: "",
            chosenName: "",
            description: "",
            desiredContent: "",
            files: [],
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);
        submitRequest(
            {
                teacherName: input.teacherName,
                chosenName: input.chosenName,
                description: input.description,
                desiredContent: input.desiredContent,
                files: input.files,
            },
            {
                onSuccess: () => {
                    setSent(true);
                    setShowLoader(false);
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
                                    Thanks for requesting a tutor! Your tutor
                                    will be created shortly. You'll get an email
                                    once it's ready for your students to use.
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
                <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <Card className="max-w-[35rem]">
                        <CardHeader>
                            <CardTitle className="font-bold text-2xl flex flex-row justify-between">
                                Create Tutor{" "}
                                <X onClick={onClose} cursor={"pointer"} />
                            </CardTitle>
                            <CardDescription>
                                Fill out the following to create your tutor.
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
                                        name="teacherName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    What do your student call
                                                    you?
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Mr. Smith, Ms. K, John, etc."
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="chosenName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    What do you want to name
                                                    this tutor?
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Mr. Smith's Tutor, Steve, Benjamin Franklin, etc."
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormDescription>
                                                    This can be whatever you
                                                    want! If you're making a
                                                    tutor based on a historical
                                                    figure consider using their
                                                    name (e.g. Benjamin
                                                    Franklin)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Describe who this tutor is
                                                    and what their job is.
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="This is a tutor for my 6th grade science class. It's based on the content I've uploaded to Educado. 
                                                        Will be used for my period 3 and 6 classes. "
                                                        {...field}
                                                        rows={3}
                                                    />
                                                </FormControl>

                                                <FormDescription>
                                                    This is mainly for you to
                                                    see on your dashboard and to
                                                    keep track of your tutors.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="desiredContent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Content you want your tutor
                                                    to know
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Links to lecture slides, links to online resources, Standards, etc."
                                                        {...field}
                                                        rows={3}
                                                    />
                                                </FormControl>

                                                <FormDescription>
                                                    Anything that you want your
                                                    tutor to know or your
                                                    students might ask about.
                                                    Things like state standards
                                                    or google slides links. If
                                                    you need to upload files or
                                                    have specific requests,
                                                    email them to{" "}
                                                    <a
                                                        className="text-green underline"
                                                        href="mailto:3bobbyzhong3@gmail.com"
                                                    >
                                                        3bobbyzhong3@gmail.com
                                                    </a>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* <FormField
                                        control={form.control}
                                        name="files"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Content you want your tutor
                                                    to know
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 pt-[6px]"
                                                        {...field}
                                                        accept=".pdf,.docx,.txt,.pptx,.doc,.xlsx,.xls,image/*,.ppt"
                                                        multiple={true}
                                                    />
                                                </FormControl>

                                                <FormDescription>
                                                    Anything that you want your
                                                    tutor to know or your
                                                    students might ask about.
                                                    Things like state standards
                                                    or google slides links
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /> */}

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
        );
    }
};
