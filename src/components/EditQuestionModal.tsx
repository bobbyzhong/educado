"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { editQuestionSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { contentRequestSchema } from "@/schemas/form/quiz";
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
import { useRouter } from "next/navigation";

type Props = {
  isVisible: any;
  onClose: any;
  questionId: string;
  answer: string;
  question: string;
  options: string[];
};

type Input = z.infer<typeof editQuestionSchema>;

const EditQuestionModal = ({
  isVisible,
  onClose,
  questionId,
  answer,
  question,
  options,
}: Props) => {
  if (!isVisible) return null;
  const router = useRouter();

  const [showLoader, setShowLoader] = React.useState(false);

  const handleClose = (e: any) => {
    if (e.target.id === "wrapper") onClose();
  };

  const { mutate: submitEdit, isLoading } = useMutation({
    mutationFn: async ({
      questionId,
      answer,
      question,
      option2,
      option3,
      option4,
    }: Input) => {
      const response = await axios.post("/api/editQuestion", {
        questionId,
        answer,
        question,
        option2,
        option3,
        option4,
      });
      console.log("RESPONSE DATA");
      console.log(response.data);
      return response.data;
    },
  });

  async function deleteQuestion(questionId: string) {
    const response = await axios.post("/api/deleteQuestion", {
      questionId,
    });
    console.log(response.data);
    router.refresh();
    onClose();
    return response.data;
  }

  const form = useForm<Input>({
    resolver: zodResolver(contentRequestSchema),
    defaultValues: {
      questionId: questionId,
      answer: answer,
      question: question,
      option2: options[1],
      option3: options[2],
      option4: options[3],
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>, input: Input) {
    e.preventDefault();
    try {
      setShowLoader(true);
      submitEdit(
        {
          questionId: input.questionId,
          answer: input.answer,
          question: input.question,
          option2: input.option2,
          option3: input.option3,
          option4: input.option4,
        },
        {
          onSuccess: () => {
            console.log("SAVED!");
            // SHOW TOAST
            router.refresh();
            onClose();
          },
          onError: () => {
            setShowLoader(false);
            console.log("Could not generate");
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  form.watch();

  return (
    <div
      className="z-[60] fixed inset-0 bg-black rounded-xl bg-opacity-25 backdrop-blur-sm
        flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="w-[550px] flex flex-col bg-white1 rounded-xl">
        <Card className="max-w-[38rem]">
          <CardHeader>
            <CardTitle className="font-bold w-full flex justify-between flex-row text-2xl">
              <div>Edit Question</div>
              <X onClick={onClose} cursor={"pointer"} />
            </CardTitle>
            <CardDescription>
              Don't forget to save your changes!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  onSubmit(e, form.getValues());
                }}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} rows={1} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} rows={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="option2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option 2</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} rows={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="option3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option 3</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} rows={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="option4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option 4</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} rows={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex flex-row justify-between items-center">
                  <Button variant={"green"} disabled={isLoading} type="submit">
                    Save
                  </Button>
                  <h1
                    onClick={() => deleteQuestion(questionId)}
                    className="text-sm text-red-500 underline cursor-pointer"
                  >
                    Delete Question
                  </h1>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default EditQuestionModal;
