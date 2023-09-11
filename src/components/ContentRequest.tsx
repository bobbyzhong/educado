"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { contentRequestSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "./ui/button";
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
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import { LucideLayoutDashboard } from "lucide-react";

type Props = { name: string };

type Input = z.infer<typeof contentRequestSchema>;

const ContentRequest = ({ name }: Props) => {
  const [showLoader, setShowLoader] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const { mutate: submitRequest, isLoading } = useMutation({
    mutationFn: async ({ content }: Input) => {
      const response = await axios.post("/api/contentRequest", {
        name,
        content,
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
        <div className="flex flex-col items-end">
          <Card className="w-[30rem]">
            <CardHeader>
              <CardTitle className="font-semibold text-[21px]">
                Request Sent!
              </CardTitle>
              <CardDescription className="text-[16px] ">
                Hello! I'll be uploading the content you provided to Pear's
                database as soon as I can. You should be able to create a
                "Custom Content" or "Textbook" check-in based on this content
                within an hour or so. Thanks!
                <div className="flex flex-row justify-between mt-5">
                  <h1 className="">-Bobby</h1>
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/dashboard"
                      className={buttonVariants({
                        variant: "green",
                      })}
                    >
                      <LucideLayoutDashboard className="mr-2" />
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  } else {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Card className="max-w-[38rem]">
          <CardHeader>
            <CardTitle className="font-bold text-2xl">
              Content Request
            </CardTitle>
            <CardDescription>
              Request for the content you want to base your check-ins off of.
              Could be name of the textbook you use or links material like
              slides, docs, websites, or standards
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
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="NGSS Standards, ..."
                          {...field}
                          rows={5}
                        />
                      </FormControl>

                      <FormDescription>
                        Make sure the links are valid and names of textbooks or
                        standards are spelled correctly
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant={"green"} disabled={isLoading} type="submit">
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
export default ContentRequest;
