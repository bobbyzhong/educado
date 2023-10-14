import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { NextRequest, NextResponse } from "next/server";

export const getContext = async (
    client: any,
    indexName: any,
    question: string,
    tutorName: string
) => {
    // 1. Start query process
    console.log("Querying Pinecone vector store...");
    // 2. Retrieve the Pinecone index
    const index = client.Index(indexName);

    console.log("QUESTION: ", question);
    console.log("TUTOR NAME: ", tutorName);
    // 3. Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
    // 4. Query Pinecone index and return top 10 matches

    let queryResponse = await index.query({
        queryRequest: {
            topK: 3,
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
    // 5. Log the number of matches
    console.log(`Found ${queryResponse.matches.length} matches ...`);
    if (queryResponse.matches.length === 0) {
        // Handle the case of no relevant matches
        console.log("No relevant matches found.");
        return null;
    }

    // WILL NEED TO HANDLE CASE OF NO MATCHES

    const concatenatedPageContent = queryResponse.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
    return concatenatedPageContent;
};

export const createPrompt = (
    latestQuestion: string,
    context: string,
    defaultPrompt: string
) => {
    const prompt = `${defaultPrompt} ${latestQuestion}. Here is the context: [${context}]`;
    return prompt;
};

export function detectEmotionalIssues(complaint: string) {
    console.log("Detected emotional issues...");
    console.log("Complaint is: ", complaint);
}

export function detectEssayRequest(essayTopic: string) {
    console.log("Detected essay request...");
    console.log("Essay topic is: ", essayTopic);
    return `Tell the student you cannot write an essay for them but say 
    you are happy to help them brainstorm. Say nothing more than that`;
}

export async function runFunction(name: string, args: any) {
    switch (name) {
        case "detectEssayRequest":
            return detectEssayRequest(args.essayTopic);
    }
}

export const functions = [
    // {
    //     name: "detectEmotionalIssues",
    //     description:
    //         "Detects if the student is having emotional issues or is complaining about a problem",
    //     parameters: {
    //         type: "object",
    //         properties: {
    //             complaint: {
    //                 type: "string",
    //                 description:
    //                     "The student's complaint or the problem they are having",
    //             },
    //         },
    //         require: ["complaint"],
    //     },
    // },
    {
        name: "detectEssayRequest",
        description: `Detects if student as asking tutor to write an essay for them and returns a specific 
        response if they are.`,
        parameters: {
            type: "object",
            properties: {
                essayTopic: {
                    type: "string",
                    description:
                        "The topic of the essay the student wants an essay about",
                },
            },
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
