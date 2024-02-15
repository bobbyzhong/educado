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
    createHelperSchema,
    createTutorRequestSchema,
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
import {
    Atom,
    ChevronRight,
    Contact,
    LucideLayoutDashboard,
    Pen,
    PenLine,
    X,
} from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../ui/select";

type Input = z.infer<typeof createHelperSchema>;

export const CreateHelperModal = ({
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
    const [tutorType, setTutorType] = React.useState("");

    const { mutate: submitRequest, isLoading } = useMutation({
        mutationFn: async ({ chosenName, subject }: Input) => {
            console.log("SUBMITTING");
            const response = await axios.post("/api/newHelperRequest", {
                chosenName,
                subject,
                userId,
            });
            console.log("RESPONSE DATA");
            console.log(response.data);
            return response.data;
        },
    });

    const form = useForm<Input>({
        resolver: zodResolver(createHelperSchema),
        defaultValues: {
            chosenName: "",
            subject: "",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);
        submitRequest(
            {
                chosenName: input.chosenName,
                subject: input.subject,
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
    console.log(form.formState.errors);

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
                                    Helper Created!{" "}
                                    <X onClick={onClose} cursor={"pointer"} />
                                </CardTitle>

                                <CardDescription className="text-[16px] ">
                                    Your homework helper will now show up in
                                    your list of helpers. You might need to
                                    refresh the page!
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
                <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
                    <Card className="w-[33rem] md:w-[40rem]">
                        <CardHeader>
                            <CardTitle className="font-bold text-2xl flex flex-row justify-between">
                                Create Homework Helper{" "}
                                <X onClick={onClose} cursor={"pointer"} />
                            </CardTitle>
                            <CardDescription>
                                Fill out the following to create your helper
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="chosenName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    What do you want to name
                                                    this helper?
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Albert Einstein"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormDescription>
                                                    This can be whatever you
                                                    want!
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem className="z-[999]">
                                                <FormLabel>
                                                    Homework Helper Subject
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={""}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a subject" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="z-[999]">
                                                        <SelectItem value="Math">
                                                            Math
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Currently we only support
                                                    math but we are working on
                                                    adding more subjects!
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
        );
    }
};
