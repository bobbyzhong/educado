import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { timeout } from "./config";
import {
    customCheckInSchemaAPI,
    textbookCheckInSchema,
} from "@/schemas/form/quiz";
import { getQuestionsSchema } from "@/schemas/questions";

export const standardEmbedInputAndQueryLLM = async (
    client: any,
    indexName: any,
    promptObj: any
) => {
    console.time("START");
    const { amount, topic, type, context, standard } =
        getQuestionsSchema.parse(promptObj);

    const question = `You are a helpful AI that is able to generate ${amount} sets of mcq questions about this specific topic: "${topic}" from this academic standard: "${standard}". 
        Make sure the questions on those topics are based on the standard's core ideas relating to that topic. Don't use any outside
         information besides the content you are given
        Base the questions on this context if available: "${context}". The length of the answer should be less than 15 words and give
         three additional options for each question labeled "option1", "option2", and "option3". 
    Store all the sets of question, answer, and options in a JSON object.
        You must format your output as a JSON value that adheres to a given "JSON Schema" instance. "JSON Schema" is a declarative language 
        that allows you to annotate and validate JSON documents. For example, the example  "JSON Schema" instance
        {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}} 
        would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property 
        semantically describes it as "a list of test words". The items within "foo" must be strings. Thus, the object {{"foo": ["bar", "baz"]}} is a 
        well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted. 
        Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema
        exactly and there are no trailing commas! Here is an example: {"questions": [{"question": "What is the capital of France?", "answer": "Paris", "option1": "Albany", "option2": "Istanbul", "option3": "Madrid"},
            {"question": "What is the capital of Spain?", "answer": "Madrid", "option1": "Austin", "option2": "Barcelona", "option3": "Toronto"}]}.]}`;

    // 1. Start query process
    console.log("Querying Pinecone vector store...");
    // 2. Retrieve the Pinecone index
    const index = client.Index(indexName);

    // 3. Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
    // 4. Query Pinecone index and return top 10 matches

    let queryResponse = await index.query({
        queryRequest: {
            topK: 10,
            vector: queryEmbedding,
            includeMetadata: true,
            includeValues: true,
            filter: {
                standardName: { $eq: standard },
            },
        },
    });

    // 5. Log the number of matches
    console.log(`Found ${queryResponse.matches.length} matches ...`);
    // 6. Log the questions being asked
    console.log(`Asking question: ${question} ...`);
    if (queryResponse.matches.length) {
        console.time("START2");
        // 7. Create an OpenAI instance and load the QAStuffChain
        const llm = new OpenAI({ modelName: "gpt-3.5-turbo" });
        const chain = loadQAStuffChain(llm);
        // 8. Extract and concatenate page content from matched documents
        const concatenatedPageContent = queryResponse.matches
            .map((match: any) => match.metadata.pageContent)
            .join(" ");
        const result = await chain.call({
            input_documents: [
                new Document({ pageContent: concatenatedPageContent }),
            ],
            question: question,
        });
        console.timeEnd("START2");
        // 10. Log the answer
        console.log(`Answer: ${result.text}`);
        console.timeEnd("START");
        return result.text;
    } else {
        // 11. Log that there are no matches so gpt will not be queried
        console.log("Since there are no matches, GPT will not be queried. ");
    }
};

export const customEmbedInputAndQueryLLM = async (
    client: any,
    indexName: any,
    promptObj: any
) => {
    const { amount, name, content, type, emphasize, standard } =
        customCheckInSchemaAPI.parse(promptObj);

    let question: string;
    if (standard === "none") {
        question = `You are a helpful AI that is able to generate ${amount} sets of mcq questions based on the the following content(s) from ${name}: "${content}".
     Do not create the questions based on any content besides those titled ${content}. Put an emphasis on these concepts if possible: "${emphasize}".
    The length of the answer should be less than 15 words and give three additional options for each question labeled "option1", "option2", and "option3". 
    Store all the sets of question, answer, and options in a JSON object.
    You must format your output as a JSON value that adheres to a given "JSON Schema" instance. "JSON Schema" is a declarative language 
    that allows you to annotate and validate JSON documents. For example, the example  "JSON Schema" instance
    {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}} 
    would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property 
    semantically describes it as "a list of test words". The items within "foo" must be strings. Thus, the object {{"foo": ["bar", "baz"]}} is a 
    well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted. 
    Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema
        exactly and there are no trailing commas! Here is an example: {"questions": [{"question": "What is the capital of France?", "answer": "Paris", "option1": "Albany", "option2": "Istanbul", "option3": "Madrid"},
        {"question": "What is the capital of Spain?", "answer": "Madrid", "option1": "Austin", "option2": "Barcelona", "option3": "Toronto"}]}.]}`;
    } else {
        question = `You are a helpful AI that is able to generate ${amount} sets of mcq questions based on the the following content(s) from ${name}: "${content}". Base it on this academic standard: "${standard}".
     Do not create the questions based on any content besides those associated with ${content} and this standard, "${standard}". Put an emphasis on these concepts if possible: "${emphasize}".
    The length of the answer should be less than 15 words and give three additional options for each question labeled "option1", "option2", and "option3". 
    Store all the sets of question, answer, and options in a JSON object.
    You must format your output as a JSON value that adheres to a given "JSON Schema" instance. "JSON Schema" is a declarative language 
    that allows you to annotate and validate JSON documents. For example, the example  "JSON Schema" instance
    {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}} 
    would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property 
    semantically describes it as "a list of test words". The items within "foo" must be strings. Thus, the object {{"foo": ["bar", "baz"]}} is a 
    well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted. 
    Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema
        exactly and there are no trailing commas! Here is an example: {"questions": [{"question": "What is the capital of France?", "answer": "Paris", "option1": "Albany", "option2": "Istanbul", "option3": "Madrid"},
        {"question": "What is the capital of Spain?", "answer": "Madrid", "option1": "Austin", "option2": "Barcelona", "option3": "Toronto"}]}.]}`;
    }
    // 1. Start query process
    console.log("Querying Pinecone vector store...");
    // 2. Retrieve the Pinecone index
    const index = client.Index(indexName);
    // 3. Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
    // 4. Query Pinecone index and return top 10 matches
    let queryResponse = await index.query({
        queryRequest: {
            topK: 10,
            vector: queryEmbedding,
            includeMetadata: true,
            includeValues: true,
            filter: {
                userName: { $eq: name },
            },
        },
    });

    // 5. Log the number of matches
    console.log(`Found ${queryResponse.matches.length} matches ...`);
    // 6. Log the questions being asked
    console.log(`Asking question: ${question} ...`);
    if (queryResponse.matches.length) {
        // 7. Create an OpenAI instance and load the QAStuffChain
        const llm = new OpenAI({ modelName: "gpt-3.5-turbo" });
        const chain = loadQAStuffChain(llm);
        // 8. Extract and concatenate page content from matched documents
        const concatenatedPageContent = queryResponse.matches
            .map((match: any) => match.metadata.pageContent)
            .join(" ");
        const result = await chain.call({
            input_documents: [
                new Document({ pageContent: concatenatedPageContent }),
            ],
            question: question,
        });
        // 10. Log the answer
        console.log(`Answer: ${result.text}`);
        return result.text;
    } else {
        // 11. Log that there are no matches so gpt will not be queried
        console.log("Since there are no matches, GPT will not be queried. ");
    }
};

export const embedInputAndQueryLLM = async (
    client: any,
    indexName: any,
    promptObj: any
) => {
    const { amount, topic, type, textbook, chapters } =
        textbookCheckInSchema.parse(promptObj);

    const question = `You are a helpful AI that is able to generate ${amount} sets of mcq questions based on chapter(s) "${chapters}" from textbook "${textbook}". Put an emphasis on these concepts if possible: "${topic}". 
    The length of the answer should be less than 15 words and give three additional options for each question labeled "option1", "option2", and "option3". 
    Store all the sets of question, answer, and options in a JSON object.
    You must format your output as a JSON value that adheres to a given "JSON Schema" instance. "JSON Schema" is a declarative language 
    that allows you to annotate and validate JSON documents. For example, the example  "JSON Schema" instance
    {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}} 
    would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property 
    semantically describes it as "a list of test words". The items within "foo" must be strings. Thus, the object {{"foo": ["bar", "baz"]}} is a 
    well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted. 
    Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema
        exactly and there are no trailing commas! Here is an example: {"questions": [{"question": "What is the capital of France?", "answer": "Paris", "option1": "Albany", "option2": "Istanbul", "option3": "Madrid"},
        {"question": "What is the capital of Spain?", "answer": "Madrid", "option1": "Austin", "option2": "Barcelona", "option3": "Toronto"}]}.]}`;

    // 1. Start query process
    console.log("Querying Pinecone vector store...");
    // 2. Retrieve the Pinecone index
    const index = client.Index(indexName);
    // 3. Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
    // 4. Query Pinecone index and return top 10 matches
    let queryResponse = await index.query({
        queryRequest: {
            topK: 10,
            vector: queryEmbedding,
            includeMetadata: true,
            includeValues: true,
            filter: {
                textbookName: { $eq: textbook },
            },
        },
    });
    // 5. Log the number of matches
    console.log(`Found ${queryResponse.matches.length} matches ...`);
    // 6. Log the questions being asked
    console.log(`Asking question: ${question} ...`);
    if (queryResponse.matches.length) {
        // 7. Create an OpenAI instance and load the QAStuffChain
        const llm = new OpenAI({ modelName: "gpt-3.5-turbo" });
        const chain = loadQAStuffChain(llm);
        // 8. Extract and concatenate page content from matched documents
        const concatenatedPageContent = queryResponse.matches
            .map((match: any) => match.metadata.pageContent)
            .join(" ");
        const result = await chain.call({
            input_documents: [
                new Document({ pageContent: concatenatedPageContent }),
            ],
            question: question,
        });
        // 10. Log the answer
        console.log(`Answer: ${result.text}`);
        return result.text;
    } else {
        // 11. Log that there are no matches so gpt will not be queried
        console.log("Since there are no matches, GPT will not be queried. ");
    }
};

export const createPineconeIndex = async (
    client: any,
    indexName: any,
    vectorDimension: any
) => {
    // 1. Initiate index existence check
    console.log(`Checking "${indexName}"... `);
    // 2. Get list of existing indexes
    const existingIndexes = await client.listIndexes();
    // 3. If index doesn't exist, create it
    if (!existingIndexes.includes(indexName)) {
        // 4. Log index creation initiation
        console.log(`Creating "${indexName}"...`);
        // 5. Create Index
        await client.createIndex({
            createRequest: {
                name: indexName,
                dimension: vectorDimension,
                metric: "cosine",
            },
        });
        // 6. Log successful creation
        console.log(
            `Creating index... please wait for it to finish initializing. `
        );

        // 7. Wait for index initialization
        await new Promise((resolve) => setTimeout(resolve, timeout));
    } else {
        // 8. Log if index already exists
        console.log(`"${indexName}" already exists. `);
    }
};

export const updatePinecone = async (
    client: any,
    indexName: any,
    docs: any
) => {
    // 1. Retrieve pinecone index
    const index = client.Index(indexName);
    // 2. Log the retrieved index name.
    console.log(`Pinecone index retrieved: ${indexName}`);

    // 3. Process each document in the docs array
    for (const doc of docs) {
        console.log(`Processing document: ${doc.metadata.source}`);
        const txtPath = doc.metadata.source;
        const text = doc.pageContent;
        // 4. Create RecursiveCharacterTextSplitter instance
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        });
        console.log("Splitting text into chunks...");
        // 5. Split text into chunks (documents)
        const chunks = await textSplitter.createDocuments([text]);
        console.log(`Text split into ${chunks.length} text chunks ...`);
        console.log(
            `Calling OpenAI's embeddings endpoint documents with ${chunks.length} text chunks ...`
        );
        // 6. Create OpenAI embeddings for documents
        const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
        );
        console.log(
            `Creating ${chunks.length} vectors array with id, values, and metadata ...`
        );

        // 7. Create and upsert vectors in batches of 100
        const batchSize = 100;
        let batch: any = [];
        for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];
            const vector = {
                id: `${txtPath}_${idx}`,
                values: embeddingsArrays[idx],
                metadata: {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    txtPath: txtPath,
                    // MAKE SURE IT IS SAME AS THE DROPDOWN OPTION
                    tutorName: "ca_science_4th",
                    standardName: "",
                    // userName: "Bethany Allen",
                    // textbookName:
                    //     "The United States Through Industrialism 8th Grade Third Edition",
                },
            };
            batch = [...batch, vector];

            // When batch is full or it's the last item, upsert the vectors.
            if (batch.length === batchSize || idx === chunks.length - 1) {
                console.log("GOT HERE");
                await index.upsert({
                    upsertRequest: {
                        vectors: batch,
                    },
                });
                // Empty the batch
                batch = [];
            }
        }
        console.log("upserted");
    }
};

export const queryPineconeVectorStoreAndQueryLLM = async (
    client: any,
    indexName: any,
    question: any
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
            topK: 10,
            vector: queryEmbedding,
            includeMetadata: true,
            includeValues: true,
        },
    });
    // 5. Log the number of matches
    console.log(`Found ${queryResponse.matches.length} matches ...`);
    // 6. Log the questions being asked
    console.log(`Asking question: ${question} ...`);
    if (queryResponse.matches.length) {
        // 7. Create an OpenAI instance and load the QAStuffChain
        const llm = new OpenAI({ modelName: "gpt-3.5-turbo" });
        const chain = loadQAStuffChain(llm);
        // 8. Extract and concatenate page content from matched documents
        const concatenatedPageContent = queryResponse.matches
            .map((match: any) => match.metadata.pageContent)
            .join(" ");
        const result = await chain.call({
            input_documents: [
                new Document({ pageContent: concatenatedPageContent }),
            ],
            question: question,
        });
        // 10. Log the answer
        console.log(`Answer: ${result.text}`);
        return result.text;
    } else {
        // 11. Log that there are no matches so gpt will not be queried
        console.log("Since there are no matches, GPT will not be queried. ");
    }
};
