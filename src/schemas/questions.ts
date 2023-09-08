import { z } from "zod";

export const getQuestionsSchema = z.object({
    topic: z
        .string()
        .min(4, {
            message: "Topic must be at least 4 characters long",
        })
        .max(200, {
            message: "Topic must be at most 200 characters long",
        }),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1).max(10),
    context: z.string(),
    standard: z.string().min(0).max(100),
});

export const checkAnswerSchema = z.object({
    questionId: z.string(),
    userAnswer: z.string(),
});

export const endGameSchema = z.object({
    gameId: z.string(),
});
