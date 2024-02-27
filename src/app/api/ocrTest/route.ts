// app/api/chat/route.ts
export const maxDuration = 30; // 5 seconds
export const dynamic = "force-dynamic";
import OpenAI from "openai";
import { JSONValue, OpenAIStream, StreamingTextResponse } from "ai";
import {
    createPrompt,
    detectEmotionalIssues,
    detectEssayRequest,
    functions,
    getContext,
    getDateInString,
    runFunction,
} from "../../../../tutorUtils";
import { PineconeClient } from "@pinecone-database/pinecone";
import { indexName } from "../../../../config";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    let body = await req.json();
    console.log(body.problemContext);

    let completion;

    completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Given a problem from a student, return a JSON object with one key named "steps" which contains a list of
                steps to solving the problem. The steps should be in the form of a list of strings and should be numbered. Type out math symbols and equations in LaTex`,
            },
            {
                role: "user",
                content: `PROBLEM: [${body.textResult}]. ADDITIONAL INSTRUCTIONS: [${body.problemContext}]`,
            },
        ],
        model: "gpt-4-0125-preview",
        response_format: { type: "json_object" },
    });
    console.log("MESSAGE: ", completion.choices[0].message.content);

    return NextResponse.json(
        { data: completion.choices[0].message.content },
        { status: 200 }
    );

    // let messages = body.messages;

    // const slicedMessages = messages.slice(-3);
    // const filteredConversation = slicedMessages.filter(
    //     (item: any) => item.role !== "system"
    // );
    // const contentArray = filteredConversation.map((item: any) => item.content);
    // const conversationString = contentArray.join("\n\n");

    // messages.unshift({
    //     role: "system",
    //     content: body.defaultPrompt,
    // });

    // const client = new PineconeClient();
    // await client.init({
    //     apiKey: process.env.PINECONE_API_KEY || "",
    //     environment: process.env.PINECONE_ENVIRONMENT || "",
    // });

    // let latestQuestion = messages[messages.length - 1].content;
    // let context = "";

    // if (body.tutorType != null && body.tutorType === "Figure") {
    //     const figLatestQuestion = body.tutorDisplayName + " " + latestQuestion;
    //     context = await getContext(
    //         client,
    //         indexName,
    //         figLatestQuestion,
    //         body.tutorName,
    //         conversationString
    //     );
    // } else {
    //     context = await getContext(
    //         client,
    //         indexName,
    //         latestQuestion,
    //         body.tutorName,
    //         conversationString
    //     );
    // }

    // const prompt = createPrompt(latestQuestion, context, body.defaultPrompt);

    // messages[messages.length - 1].content = prompt;
    // // messages = messages.slice(-4);
    // // Request the OpenAI API for the response based on the prompt

    // console.log("MESSAGES ", messages);

    // const response = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo-0125",
    //     stream: true,
    //     messages: messages,
    //     functions,
    //     function_call: "auto",
    // });

    // // Convert the response into a friendly text-stream
    // const stream = OpenAIStream(response, {
    //     experimental_onFunctionCall: async (
    //         { name, arguments: args },
    //         createFunctionCallMessages
    //     ) => {
    //         console.log("ARGS: ", args);
    //         console.log("NAME: ", name);

    //         const result = await runFunction(
    //             name,
    //             args,
    //             body.teacherId,
    //             body.studentName,
    //             body.tutorDisplayName
    //         );
    //         const newMessages = createFunctionCallMessages(result!);
    //         console.log("NEW MESSAGES: ", newMessages);

    //         return openai.chat.completions.create({
    //             model: "gpt-3.5-turbo-1106",
    //             stream: true,
    //             messages: [...messages, ...newMessages],
    //         });
    //     },
    //     onCompletion: async (completion) => {
    //         try {
    //             await fetch(`${process.env.API_URL}/api/logTutorQuestion`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     question: latestQuestion,
    //                     studentName: body.studentName,
    //                     tutorId: body.tutorId,
    //                     userId: body.userId,
    //                     answer: completion,
    //                 }),
    //             });
    //         } catch (e) {
    //             console.log("ERROR: ", e);
    //         }
    //     },
    // });

    // // Respond with the stream
    // return new StreamingTextResponse(stream);
}
