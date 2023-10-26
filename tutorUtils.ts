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

    console.log("FIRST SCORE: ", queryResponse.matches[0].score);
    let filteredRes = [];
    for (let i = 0; i < queryResponse.matches.length; i++) {
        if (queryResponse.matches[i].score >= 0.78) {
            filteredRes.push(queryResponse.matches[i]);
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
        return "No context";
    }

    // WILL NEED TO HANDLE CASE OF NO MATCHES

    const concatenatedPageContent = filteredRes
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

    const prompt = `STUDENT'S QUESTION: ${latestQuestion}. Here is the optional context: [${context}]`;
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
    return `Do not write the essay for the student. Tell the student you cannot write an essay for them but say 
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
        description: `Detects if student is asking tutor to write an essay for them and returns a specific 
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
