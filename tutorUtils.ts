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
    // `You are a helpful tutor for a student in middle or high school. Your name is Albert and you are a
    // helpful tutor. Be concise when you can and speak in a happy and fun tone. Use the context given to you
    //  below and previous messages to answer the student's question. `
    const prompt = `${defaultPrompt} If the context doesn't contain any information that relates
    to the question respond by saying you don't have knowledge on that specific 
    area and recommend the student to ask their teacher to make a tutor about that topic if they want to learn about that.
    Use only the information from the context below to answer the question. If the context isn't related to the question,
    tell the student you don't have knowledge on that topic. 
     Here is the student's question: ${latestQuestion}. Here is the context: [${context}]`;
    return prompt;
};

export function detectEmotionalIssues(complaint: string) {
    console.log("Detected emotional issues...");
    console.log("Complaint is: ", complaint);
    return `Support the student and tell them you are sorry they are going through that. Advice them to seek Support
    from a trusted adult or a counselor.`;
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
        case "detectEmotionalIssues":
            return detectEmotionalIssues(args.complaint);
    }
}

export const functions = [
    {
        name: "detectEmotionalIssues",
        description: `Detects if the student is having emotional issues or
        complaining about a problem in school and returns a specific response if they are
         `,
        parameters: {
            type: "object",
            properties: {
                complaint: {
                    type: "string",
                    description:
                        "The student's complaint or the problem they are having",
                },
            },
            require: [],
        },
    },
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
