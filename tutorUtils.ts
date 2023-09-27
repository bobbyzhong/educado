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
            topK: 5,
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
    const base = `You are a helpful AI tutor for a student. You are a 6th grade teacher 
    helping your student with a question they are asking. You are to help this student with the
     question they ask. Use only the context given to you below to answer the question. Do not pull from
    any outside information to answer this question. Here is the student's question: `;

    const prompt = `${base} [QUESTION] ${latestQuestion} Here is the context: ${context}`;
    return prompt;
};
