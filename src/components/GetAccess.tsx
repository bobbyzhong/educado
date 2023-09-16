"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { getAccessSchema } from "@/schemas/form/quiz";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

type Props = {};

type Input = z.infer<typeof getAccessSchema>;

const GetAccess = (props: Props) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    const { mutate: submitRequest, isLoading } = useMutation({
        mutationFn: async ({ name, school, subject, contact }: Input) => {
            // response makes api call to create new game in db and then returns the game id
            const response = await axios.post("/api/send", {
                name,
                school,
                subject,
                contact,
            });
            console.log("RESPONSE DATA");
            console.log(response.data);
            return response.data;
        },
    });

    const form = useForm<Input>({
        resolver: zodResolver(getAccessSchema),
        defaultValues: {
            name: "",
            school: "",
            subject: "",
        },
    });

    function onSubmit(input: Input) {
        setShowLoader(true);
        submitRequest(
            {
                name: input.name,
                school: input.school,
                subject: input.subject,
                contact: input.contact,
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
            <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <Card className="w-[25rem]">
                    <CardHeader>
                        <CardTitle className="font-semibold text-[21px]">
                            Request Sent!
                        </CardTitle>
                        <CardDescription className="text-[16px] ">
                            Thanks for requesting to try Pear! I will get back
                            to you within a day or two with instructions to sign
                            up!
                            <h1 className="mt-2">-Bobby</h1>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    } else {
        return (
            <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <Card className="min-w-[25rem]">
                    <CardHeader>
                        <CardTitle className="font-bold text-2xl">
                            Get Access to Educado!
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Please provide your full name
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="school"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                School you teach at
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Lakewood High School"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Subject you teach
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Math, History, Science, etc."
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email or Phone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="example@gmail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Instructions for signup will be
                                                sent there
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
        );
    }
};
export default GetAccess;
