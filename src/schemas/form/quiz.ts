import { any, z } from "zod";

export const quizCreationSchema = z.object({
    topic: z
        .string()
        .min(4, { message: "Topic must be at least 4 characters long" })
        .max(200),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1).max(10),
    context: z.string().min(0).max(1500),
    standard: z.string().min(0).max(100),
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

export const getAccessSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50),
    school: z
        .string()
        .min(5, { message: "School name must be at least 5 characters long" })
        .max(50),
    contact: z
        .string()
        .min(5, { message: "Contact info must be at least 5 characters long" })
        .max(50),
    subject: z
        .string()
        .min(2, { message: "Subject name must be at least 2 characters long" })
        .max(50),
});

export const contentRequestSchema = z.object({
    content: z
        .string()
        .min(4, { message: "Topic must be at least 4 characters long" }),
});

export const contentRequestSchemaAPI = z.object({
    name: z.string(),
    content: z
        .string()
        .min(4, { message: "Topic must be at least 4 characters long" }),
});

export const customCheckInSchema = z.object({
    content: z
        .string()
        .min(3, { message: "Content must be at least 3 characters long" }),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1).max(10),
    emphasize: z.string().max(100),
    standard: z.string().min(0).max(100),
});

export const customCheckInSchemaAPI = z.object({
    content: z
        .string()
        .min(3, { message: "Content must be at least 3 characters long" }),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1).max(10),
    name: z.string(),
    emphasize: z.string().max(100),
    standard: z.string().min(0).max(100),
});

export const editQuestionSchema = z.object({
    questionId: z.string(),
    question: z
        .string()
        .min(3, { message: "Question must be at least 3 characters long" }),
    answer: z
        .string()
        .min(1, { message: "Answer must be at least 1 character long" }),
    option2: z
        .string()
        .min(1, { message: "Option 2 must be at least 1 character long" }),
    option3: z
        .string()
        .min(1, { message: "Option 3 must be at least 1 character long" }),
    option4: z
        .string()
        .min(1, { message: "Option 4 must be at least 1 character long" }),
});
export const newQuestionSchema = z.object({
    checkInId: z.string(),
    question: z
        .string()
        .min(3, { message: "Question must be at least 3 characters long" }),
    answer: z
        .string()
        .min(1, { message: "Answer must be at least 1 character long" }),
    option2: z
        .string()
        .min(1, { message: "Option 2 must be at least 1 character long" }),
    option3: z
        .string()
        .min(1, { message: "Option 3 must be at least 1 character long" }),
    option4: z
        .string()
        .min(1, { message: "Option 4 must be at least 1 character long" }),
});

export const subscribeRequest = z.object({
    name: z.string(),
    email: z.string().email(),
    paymentMethod: z.string(),
});
