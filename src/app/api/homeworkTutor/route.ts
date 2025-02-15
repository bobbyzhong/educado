// app/api/chat/route.ts

import OpenAI from "openai";
import { JSONValue, OpenAIStream, StreamingTextResponse } from "ai";
import { runFunction, functions } from "../../../../tutorUtils";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    let body = await req.json();

    let messages = body.messages;

    console.log("MESSAGES ", messages);

    if (body.tutorGrade === "elementary") {
        messages.unshift({
            role: "system",
            content: `You are a homework helper for an elementary grade student. You will be given the question the student is trying to solve as well as steps on how to solve it. 
        You are to help the student work out step by step how to solve it. For each step ask the student engaging questions to have them work it out. 
        Make your response easy to understand for a 3rd grade student. Follow the common core standards for mathematical practice when helping the student.
         Use basic vocabulary and sentences and keep your response concise. Explain steps in a super easy to understand for a 
        3rd grade student. Type math symbols in LaTex.
        Here is the question: [${body.homeworkQuestion}]. Here are the steps to the problem: [${body.steps}].`,
        });
    } else if (body.tutorGrade === "middle") {
        messages.unshift({
            role: "system",
            content: `You are a homework helper for a middle school student. You will be given the question the student is trying to solve as well as steps on how to solve it. 
        You are to help the student work out step by step how to solve it. For each step ask the student engaging questions to have them work it out.
        Make your response easy to understand for a 7th grade student. Follow the common core standards for mathematical practice when helping the student.
         Keep your response very concise and easy to understand for a middle school student. Type math symbols in LaTex
        Here is the question: [${body.homeworkQuestion}]. Here are the steps to the problem: [${body.steps}].`,
        });
    } else {
        messages.unshift({
            role: "system",
            content: `You are a homework helper for a high school student. You will be given the question the student is trying to solve as well as steps on how to solve it. 
        You are to help the student work out step by step how to solve it. Follow the common core standards for mathematical practice when helping the 
        student. F Keep your response very concise and easy to understand for a high school student. Type math symbols in LaTex
        Here is the question: [${body.homeworkQuestion}]. Here are the steps to the problem: [${body.steps}].`,
        });
    }

    let latestQuestion = messages[messages.length - 1].content;

    const prompt = "STUDENT's QUESTION: " + latestQuestion;

    messages[messages.length - 1].content = prompt;

    console.log("MESSAGES LENGTH", messages.length);

    const modelToUse = body.isPremium
        ? "gpt-4-0125-preview"
        : "gpt-3.5-turbo-1106";

    const response = await openai.chat.completions.create({
        model: modelToUse,
        stream: true,
        messages: messages,
        functions,
        function_call: "auto",
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
        experimental_onFunctionCall: async (
            { name, arguments: args },
            createFunctionCallMessages
        ) => {
            console.log("ARGS: ", args);
            console.log("NAME: ", name);

            const result = await runFunction(
                name,
                args,
                body.admins,
                body.studentName,
                body.studentId,
                body.tutorDisplayName,
                body.tutorId
            );
            const newMessages = createFunctionCallMessages(result!);
            console.log("NEW MESSAGES: ", newMessages);

            return openai.chat.completions.create({
                model: "gpt-3.5-turbo-1106",
                stream: true,
                messages: [...messages, ...newMessages],
            });
        },
        onCompletion: async (completion) => {
            try {
                await fetch(`${process.env.API_URL}/api/logTutorQuestion`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question: latestQuestion,
                        studentName: body.studentName,
                        tutorId: body.tutorId,
                        userId: body.userId,
                        answer: completion,
                    }),
                });
            } catch (e) {
                console.log("ERROR: ", e);
            }
        },
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
}
