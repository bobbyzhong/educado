"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { createTutorRequestSchema } from "@/schemas/form/quiz";
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
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

type Input = z.infer<typeof createTutorRequestSchema>;

export const CreateFigureModal = ({
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
        mutationFn: async ({
            teacherName,
            chosenName,
            description,
            desiredContent,
            files,
            presetRubric,
            prompt,
            visibility,
        }: Input) => {
            console.log("SUBMITTING");
            const response = await axios.post("/api/newFigureRequest", {
                teacherName,
                chosenName,
                description,
                userId,
                desiredContent,
                files,
                presetRubric,
                tutorType,
                prompt,
                visibility,
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
            presetRubric: "",
            prompt: "",
            visibility: true,
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
                presetRubric: input.presetRubric,
                prompt: input.prompt,
                visibility: input.visibility,
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
        if (tutorType === "") {
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
                                    Historical Figure
                                    <X onClick={onClose} cursor={"pointer"} />
                                </CardTitle>
                                <CardDescription>
                                    Fill out the following to create your figure
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="chosenName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Name of historical or
                                                        famous figure
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Benjamin Franklin"
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Chat with students, Teach students about Bill of Rights, etc."
                                                            {...field}
                                                            rows={3}
                                                        />
                                                    </FormControl>

                                                    <FormDescription>
                                                        The role you want the
                                                        figure to take on
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="visibility"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between ">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>
                                                            Make Public
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Allows other
                                                            teachers to create
                                                            copies of this
                                                            figure to use for
                                                            their students
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="desiredContent"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Preferred Resources (NA
                                                        if none)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Link to rubric, name of rubric, etc."
                                                            {...field}
                                                            rows={3}
                                                        />
                                                    </FormControl>

                                                    <FormDescription>
                                                        Links or content that
                                                        you want this figure to
                                                        know or be trained on.
                                                        If none is submitted we
                                                        will use the most
                                                        credible resources we
                                                        can find on this figure
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
    }
};
