import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const getContext = async (
    client: any,
    indexName: any,
    question: string
) => {
    // 1. Start query process
    console.log("Querying Pinecone vector store...");
    // 2. Retrieve the Pinecone index
    const index = client.Index(indexName);

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
                standardName: {
                    $eq: "Oklahoma Academic Standards for Science 6th Grade",
                },
            },
        },
    });
    // 5. Log the number of matches
    console.log(`Found ${queryResponse.matches.length} matches ...`);
    const concatenatedPageContent = queryResponse.matches
        .map((match: any) => match.metadata.pageContent)
        .join(" ");
    return concatenatedPageContent;
};

export const createPrompt = (latestQuestion: string, context: string) => {
    const base = `You are a helpful tutor for a student. You are a 6th grade teacher 
    helping your student with a question they are asking. Be concise when you can and speak in a happy and fun tone.
    If the student asks you anything inappropriate or to do the work for them, say you cannot but tell them you can help them work through it 
     Use only the context given to you below and previous messages to answer the question. Do not pull from
    any outside information to answer this question. If the answer to the question isn't found in the context just say you dont know
     Here is the student's question: `;

    const prompt = `${base} ${latestQuestion}. Here is the context: [${context}]`;
    return prompt;
};

export function detectEmotionalIssues(complaint: string) {
    console.log("Detected emotional issues...");
    console.log("Complaint is: ", complaint);
}

export const functions = [
    {
        name: "detectEmotionalIssues",
        description:
            "Detects if the student is having emotional issues or is complaining about a problem",
        parameters: {
            type: "object",
            properties: {
                complaint: {
                    type: "string",
                    description:
                        "The student's complaint or the problem they are having",
                },
            },
            require: ["complaint"],
        },
    },
    // {
    //     name: "detectEssayRequest",
    //     description: `Detects if the student is asking the tutor to write an essay for them. If so, the tutor will respond with a
    //          message that they cannot write the essay for them but they can help brainstorm or give feedback.`,
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
];
