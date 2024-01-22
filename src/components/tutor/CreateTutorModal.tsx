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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        }: Input) => {
            console.log("SUBMITTING");
            const response = await axios.post("/api/newTutorRequest", {
                teacherName,
                chosenName,
                description,
                userId,
                desiredContent,
                files,
                presetRubric,
                tutorType,
                prompt,
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
                                    Choose your tutor type{" "}
                                    <X onClick={onClose} cursor={"pointer"} />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-5">
                                    <div
                                        onClick={() => {
                                            setTutorType("general");
                                        }}
                                        className="flex flex-row justify-between cursor-pointer items-center hover:border-green
             border-[1.5px] px-4 py-3 rounded-[4.55px] border-gray2"
                                    >
                                        <div className="flex flex-row items-center">
                                            <Atom strokeWidth={1.8} size={39} />
                                            <div className="flex flex-col ml-4 pr-2">
                                                <h1 className="text-base font-[560]">
                                                    General Tutor
                                                </h1>
                                                <p className="text-[13px] text-zinc-500">
                                                    General tutor to support
                                                    your students in their
                                                    learning. You can train it
                                                    on any content you want!
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} />
                                    </div>

                                    <div
                                        onClick={() => {
                                            setTutorType("writing");
                                        }}
                                        className="flex flex-row justify-between cursor-pointer items-center hover:border-green
             border-[1.5px] px-4 py-3 rounded-[4.55px] border-gray2"
                                    >
                                        <div className="flex flex-row items-center">
                                            <PenLine size={45} />
                                            <div className="flex flex-col ml-4 pr-2">
                                                <h1 className="text-base font-[560]">
                                                    Writing Helper
                                                </h1>
                                                <p className="text-[13px] text-zinc-500">
                                                    Helps students with
                                                    brainstorming and writing a
                                                    specific prompt. You can
                                                    upload a rubric as well to
                                                    give students personalized
                                                    feedback!
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} />
                                    </div>
                                    {/* <div
                                        onClick={() => {
                                            setTutorType("figure");
                                        }}
                                        className="flex flex-row justify-between items-center hover:border-green
             border-[1.5px] px-4 py-3 rounded-[4.55px] border-gray2"
                                    >
                                        <div className="flex flex-row items-center">
                                            <Contact size={55} />
                                            <div className="flex flex-col ml-4 pr-2">
                                                <h1 className="text-base font-[560]">
                                                    Famous Figure
                                                </h1>
                                                <p className="text-[13px] text-zinc-500">
                                                    Have your students interview
                                                    a famous or historical
                                                    figure. For example,
                                                    students can learn about the
                                                    Constitution by interviewing
                                                    Ben Franklin!
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} />
                                    </div> */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        } else if (tutorType === "general") {
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
                                    Create General Tutor{" "}
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
                                        className="space-y-6"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="teacherName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        What do your student
                                                        call you?
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
                                                        tutor based on a
                                                        historical figure
                                                        consider using their
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
                                                        Describe who this tutor
                                                        is and what their job
                                                        is.
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
                                                        This is mainly for you
                                                        to see on your dashboard
                                                        and to keep track of
                                                        your tutors.
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
                                                        Content you want your
                                                        tutor to know
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Links to lecture slides, links to online resources, Standards, etc."
                                                            {...field}
                                                            rows={3}
                                                        />
                                                    </FormControl>

                                                    <FormDescription>
                                                        Anything that you want
                                                        your tutor to know or
                                                        your students might ask
                                                        about. Things like state
                                                        standards or google
                                                        slides links. If you
                                                        need to upload files or
                                                        have specific requests,
                                                        email them to{" "}
                                                        <a
                                                            className="text-green underline"
                                                            href="mailto:bobby@tryeducado.com"
                                                        >
                                                            bobby@tryeducado.com
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
        } else if (tutorType === "writing") {
            return (
                <div
                    className="z-[60] fixed  inset-0 bg-black bg-opacity-25 backdrop-blur-sm 
        flex justify-center items-center"
                    id=""
                    onClick={handleClose}
                >
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
                        <Card className="w-[33rem] md:w-[70rem]">
                            <CardHeader>
                                <CardTitle className="font-bold text-2xl flex flex-row justify-between">
                                    Writing Support Tutor{" "}
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
                                        className="gap-6 flex flex-row"
                                    >
                                        <div className="w-1/2 space-y-5">
                                            <FormField
                                                control={form.control}
                                                name="teacherName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            What do your student
                                                            call you?
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Mr. Smith"
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
                                                            What do you want to
                                                            name this tutor?
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Mr. Shakespeare"
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
                                                        <FormLabel>
                                                            Role of Tutor
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Give feedback, help brainstorm, etc."
                                                                {...field}
                                                                rows={3}
                                                            />
                                                        </FormControl>

                                                        <FormDescription>
                                                            This is how you want
                                                            the tutor to assist
                                                            your student
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="w-1/2 space-y-5">
                                            <FormField
                                                control={form.control}
                                                name="prompt"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Prompt
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder=""
                                                                {...field}
                                                                rows={3}
                                                            />
                                                        </FormControl>

                                                        <FormDescription>
                                                            Prompt of the essay
                                                            or paper your
                                                            students are writing
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* <FormField
                                                control={form.control}
                                                name="presetRubric"
                                                render={({ field }) => (
                                                    <FormItem className="z-[999]">
                                                        <FormLabel>
                                                            Preset Rubrics
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={""}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a verified email to display" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="z-[999]">
                                                                <SelectItem value="AP EURO DBQ">
                                                                    AP Euro
                                                                    Document
                                                                    Based
                                                                    Question
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>
                                                            Pick a preset rubric
                                                            if you want! If
                                                            there's a common
                                                            rubric you think we
                                                            should add, email
                                                            them to{" "}
                                                            <a
                                                                className="text-green underline"
                                                                href="mailto:bobby@tryeducado.com"
                                                            >
                                                                bobby@tryeducado.com
                                                            </a>
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            /> */}
                                            <FormField
                                                control={form.control}
                                                name="desiredContent"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Rubrics and other
                                                            content (NA if none)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Link to rubric, Example essays, Assignment Info, etc."
                                                                {...field}
                                                                rows={3}
                                                            />
                                                        </FormControl>

                                                        <FormDescription>
                                                            If you want to
                                                            upload your own file
                                                            that's not
                                                            accessible via a
                                                            link, email them to{" "}
                                                            <a
                                                                className="text-green underline"
                                                                href="mailto:bobby@tryeducado.com"
                                                            >
                                                                bobby@tryeducado.com.
                                                            </a>{" "}
                                                            Giving the tutor
                                                            additional context
                                                            on things like
                                                            assignment due date
                                                            or key points could
                                                            be helpful for your
                                                            students!
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
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        } else if (tutorType === "figure") {
            return (
                <div
                    className="z-[60] fixed  inset-0 bg-black bg-opacity-25 backdrop-blur-sm 
        flex justify-center items-center"
                    id=""
                    onClick={handleClose}
                >
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
                        <Card className="w-[33rem] md:w-[40rem]">
                            <CardHeader>
                                <CardTitle className="font-bold text-2xl flex flex-row justify-between">
                                    Historical Figure Tutor
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
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="teacherName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        What do your student
                                                        call you?
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Mr. Smith"
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
                                                            placeholder="Be interviewed, Teach students about Bill of Rights, etc."
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
