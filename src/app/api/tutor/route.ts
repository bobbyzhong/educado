// app/api/chat/route.ts

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

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    let body = await req.json();

    let messages = body.messages;

    const slicedMessages = messages.slice(-3);
    const filteredConversation = slicedMessages.filter(
        (item: any) => item.role !== "system"
    );
    const contentArray = filteredConversation.map((item: any) => item.content);
    const conversationString = contentArray.join("\n\n");

    messages.unshift({
        role: "system",
        // content: `You are a helpful tutor for a student in middle or high school. Your name is Albert and
        //         you are a helpful tutor. Be concise when you can and speak in a happy and fun tone. Don't base your answer on any information outside of the context provided.
        //         If there is No context respond by saying you are not trained on that topic. `,
        // content: `You are a helpful tutor trained on Okalahoma state science standards for a student in middle or high school. Your name is Albert and
        //         you are a helpful tutor. Be concise when you can and speak in a happy and fun tone.  Use the provided context and previous messages to answer the student's
        //         question. If the student's question is related to the context use the context to answer it and do not pull from any outside information. If it isn't related,
        //         answer like you would normally. `,
        content: `You are a helpful tutor trained on Oklahoma 6th grade science for a student in middle school. Your name is Albert and
                you are a fun, helpful tutor. Be concise when you can and speak in a happy and fun tone. If there is no context respond only by saying that you are not 
                trained in that topic. Use only the given context and previous messages to answer the student's
                question. Only answer if the student's question relates to a previous message or the context given. If it is not related to either, do not give the student an answer 
                to their question. Don't use any information not in the context. Do not use any info not in the context`,
    });

    const client = new PineconeClient();
    await client.init({
        apiKey: process.env.PINECONE_API_KEY || "",
        environment: process.env.PINECONE_ENVIRONMENT || "",
    });

    const latestQuestion = messages[messages.length - 1].content;

    const context = await getContext(
        client,
        indexName,
        latestQuestion,
        body.tutorName,
        conversationString
    );
    // console.log("CONTEXT: ", context);
    if (context === null) {
        return new Response("No relevant matches found.", { status: 200 });
    }
    const prompt = createPrompt(latestQuestion, context, body.defaultPrompt);

    messages[messages.length - 1].content = prompt;
    // messages = messages.slice(-4);
    // Request the OpenAI API for the response based on the prompt

    console.log("MESSAGES ", messages);

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
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
                body.userId,
                body.studentName,
                body.tutorDisplayName
            );
            const newMessages = createFunctionCallMessages(result!);
            console.log("NEW MESSAGES: ", newMessages);

            return openai.chat.completions.create({
                model: "gpt-3.5-turbo-0613",
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
