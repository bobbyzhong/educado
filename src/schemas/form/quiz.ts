import { any, z } from "zod";

export const quizCreationSchema = z.object({
    topic: z
        .string()
        .min(4, { message: "Topic must be at least 4 characters long" })
        .max(50),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1).max(10),
});

export const checkAnswerSchema = z.object({
    questionId: z.string(),
    userAnswer: z.string(),
});

export const checkInResponseSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name must be at least 1 character long" }),
});

export const createResultSchema = z.object({
    studentName: z.string(),
    checkInId: z.string(),
    questionResults: any(),
});

export const textbookCheckInSchema = z.object({
    topic: z
        .string()
        .min(4, { message: "Topic must be at least 4 characters long" })
        .max(50),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1).max(10),
    textbook: z.string().min(3, { message: "Must select a textbook" }),
    chapters: z.string().min(1, { message: "Must select a chapter" }),
});
