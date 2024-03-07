import { prisma } from "@/lib/db";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { NextRequest, NextResponse } from "next/server";

export const getContext = async (
    client: any,
    indexName: any,
    question: string,
    tutorName: string,
    prevMessages: string
) => {
    // 1. Start query process
    console.log("Querying Pinecone vector store...");
    // 2. Retrieve the Pinecone index
    const index = client.Index(indexName);

    console.log("QUESTION: ", question);
    console.log("TUTOR NAME: ", tutorName);
    // console.log("PREV MESSAGES: ", prevMessages);

    // const query = question + "\n Chat History: " + prevMessages;
    // 3. Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

    console.log("HERE");
    // 4. Query Pinecone index and return top 10 matches

    let queryResponse = await index.query({
        queryRequest: {
            topK: 2,
            vector: queryEmbedding,
            includeMetadata: true,
            includeValues: true,
            filter: {
                tutorName: {
                    $eq: tutorName,
                },
            },
        },
    });
    let filteredRes = [];
    if (queryResponse.matches.length > 0) {
        console.log("FIRST SCORE: ", queryResponse.matches[0].score);

        for (let i = 0; i < queryResponse.matches.length; i++) {
            if (queryResponse.matches[i].score >= 0.78) {
                filteredRes.push(queryResponse.matches[i]);
            }
        }
    }

    if (filteredRes.length > 0) {
        console.log("RESPONSE CONTENT: ", filteredRes[0].metadata.pageContent);
        console.log("SIMILARITY SCORE: ", filteredRes[0].score);
    }

    // 5. Log the number of matches
    console.log(`Found ${filteredRes.length} matches ...`);
    if (
        filteredRes.length === 0 ||
        filteredRes[0].metadata.pageContent.length < 3
    ) {
        // Handle the case of no relevant matches
        console.log("No relevant matches found.");
        const newEmbedding = await new OpenAIEmbeddings().embedQuery(
            prevMessages
        );
        let queryResponse = await index.query({
            queryRequest: {
                topK: 3,
                vector: newEmbedding,
                includeMetadata: true,
                includeValues: true,
                filter: {
                    tutorName: {
                        $eq: tutorName,
                    },
                },
            },
        });
        let filteredRes = [];
        for (let i = 0; i < queryResponse.matches.length; i++) {
            if (queryResponse.matches[i].score >= 0.78) {
                filteredRes.push(queryResponse.matches[i]);
            }
        }
        if (
            filteredRes.length === 0 ||
            filteredRes[0].metadata.pageContent.length < 3
        ) {
            return "No Context";
        }
        const concatenatedPageContent = filteredRes
            .map((match: any) => match.metadata.pageContent)
            .join(" ");
        return concatenatedPageContent;
    } else {
        const concatenatedPageContent = filteredRes
            .map((match: any) => match.metadata.pageContent)
            .join(" ");
        return concatenatedPageContent;
    }
};

export const createPrompt = (
    latestQuestion: string,
    context: string,
    defaultPrompt: string
) => {
    // `You are a helpful tutor for a student in middle or high school. Your name is Albert and you are a
    // helpful tutor. Be concise when you can and speak in a happy and fun tone. Use the context given to you
    //  below and previous messages to answer the student's question. `

    const prompt = `STUDENT'S QUESTION: "${latestQuestion}". CONTEXT: [${context}]`;
    return prompt;
};

export async function detectEmotionalIssues(
    admins: string,
    studentName: string,
    studentId: string,
    tutorName: string,
    tutorId: string
) {
    console.log("Detected emotional issue ...");

    try {
        await fetch(`${process.env.API_URL}/api/updateNotif`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                admins: admins,
                studentName: studentName,
                studentId: studentId,
                tutorName: tutorName,
                tutorId: tutorId,
            }),
        });
    } catch (e) {
        console.log("ERROR: ", e);
    }
    return `Respond in a caring way and tell the student that they should not be afraid to seek help from a teacher or counselor.`;
}

export async function detectProfanity(
    admins: string,
    studentName: string,
    studentId: string,
    tutorName: string,
    tutorId: string
) {
    console.log("Detected profanity ...");

    try {
        await fetch(`${process.env.API_URL}/api/updateNotifProfanity`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                admins: admins,
                studentName: studentName,
                studentId: studentId,
                tutorName: tutorName,
                tutorId: tutorId,
            }),
        });
    } catch (e) {
        console.log("ERROR: ", e);
    }
    return `Tell the student that they should not be using profanity and that an alert will be sent to their teacher. `;
}

export async function runFunction(
    name: string,
    args: any,
    admins: any,
    studentName: any,
    studentId: string,
    tutorName: any,
    tutorId: any
) {
    switch (name) {
        case "detectEmotionalIssues":
            return detectEmotionalIssues(
                admins,
                studentName,
                studentId,
                tutorName,
                tutorId
            );
        case "detectProfanity":
            return detectProfanity(
                admins,
                studentName,
                studentId,
                tutorName,
                tutorId
            );
    }
}

export const functions = [
    {
        name: "detectEmotionalIssues",
        description: `Detects if the student talks about emotional or mental health issues that they have. If a student talks about 
        depression, suicidal thoughts, self harm, sadness, loneliness, or other emotional issues, this function should be called and returns a specific response.`,
        parameters: {
            type: "object",
            properties: {},
            require: [],
        },
    },
    {
        name: "detectProfanity",
        description: `Detects if the student uses profanity returns a specific response if they are. Only called if one of the
        following words are used: [fuck, fucking, shit, bullshit, dick, dickhead, bitch, bastard, ass, asshole, whore, goddamn, whore,
        slut, cock, cocksucker, nigga, nigger]`,
        parameters: {
            type: "object",
            properties: {},
            require: [],
        },
    },
];

export const getDateInString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
};
