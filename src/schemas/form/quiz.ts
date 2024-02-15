import { any, z } from "zod";

export const quizCreationSchema = z.object({
    title: z
        .string()
        .max(200, { message: "Title must be less than 200 characters" }),
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
        .min(3, { message: "Must be at least 3 characters" })
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

export const tutorContentRequestSchema = z.object({
    content: z
        .string()
        .min(4, { message: "Topic must be at least 4 characters long" }),
    teacherName: z
        .string()
        .min(1, { message: "Teacher name must be at least 1 character1 long" }),
    tutorName: z
        .string()
        .min(1, { message: "Tutor name must be at least 1 characters long" }),
});

export const createTutorRequestSchema = z.object({
    teacherName: z.string(),
    chosenName: z
        .string()
        .min(1, { message: "Tutor name must be at least 1 characters long" }),
    description: z.string().min(5, {
        message: "Tutor description must be at least 5 characters long",
    }),
    desiredContent: z.string().min(2, {
        message: "Desired content must be at least 2 characters long",
    }),
    files: z.any(),
    presetRubric: z.string().optional(),
    prompt: z.string().optional(),
    visibility: z.boolean().optional(),
});

export const createHelperSchema = z.object({
    chosenName: z
        .string()
        .min(1, { message: "Tutor name must be at least 1 characters long" }),

    subject: z.string().min(1, { message: "Must choose subject" }),
});

export const createHelperAPISchema = z.object({
    chosenName: z
        .string()
        .min(1, { message: "Tutor name must be at least 1 characters long" }),

    userId: z.string(),
    subject: z.string().min(1, { message: "Must choose subject" }),
});

export const createTutorAPISchema = z.object({
    teacherName: z.string(),
    chosenName: z
        .string()
        .min(1, { message: "Tutor name must be at least 1 characters long" }),
    description: z.string().min(5, {
        message: "Tutor description must be at least 5 characters long",
    }),
    userId: z.string(),
    desiredContent: z.string(),
    presetRubric: z.string().optional(),
    tutorType: z.string(),
    files: z.any(),
    prompt: z.string().optional(),
    visibility: z.boolean().optional(),
});

export const contentRequestSchemaAPI = z.object({
    name: z.string(),
    content: z
        .string()
        .min(4, { message: "Topic must be at least 4 characters long" }),
});

export const customCheckInSchema = z.object({
    title: z
        .string()
        .max(200, { message: "Title must be less than 200 characters" }),
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
