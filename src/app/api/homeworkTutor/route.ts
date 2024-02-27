// app/api/chat/route.ts

import OpenAI from "openai";
import { JSONValue, OpenAIStream, StreamingTextResponse } from "ai";
import { runFunction } from "../../../../tutorUtils";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    let body = await req.json();
    console.log("BODY", body);

    let messages = body.messages;

    console.log("MESSAGES ", messages);
    console.log("messages last item", messages[messages.length - 1]);

    messages.unshift({
        role: "system",
        content: `You are a fun homework helper for a student. You will be given the question the student is trying to solve as well as steps on how to solve it. 
        You are to help the student work out step by step how to solve it. For each step, ask the student how they think they should proceed. Only after 
        they have given their answer should you provide the next step. Keep your response concise and easy to understand for an elementary school student. Type math symbols in LaTex
        Here is the question: [${body.homeworkQuestion}]. Here are the steps to the problem: [${body.steps}].`,
    });

    let latestQuestion = messages[messages.length - 1].content;

    const prompt = "STUDENT's QUESTION: " + latestQuestion;

    messages[messages.length - 1].content = prompt;
    // messages = messages.slice(-4);

    console.log("MESSAGES ", messages);

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        stream: true,
        messages: messages,
        // functions,
        // function_call: "auto",
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
                body.teacherId,
                body.studentName,
                body.tutorDisplayName
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
