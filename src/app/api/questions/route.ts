import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { indexName } from "../../../../config";
import { getQuestionsSchema } from "@/schemas/questions";
import { ZodError } from "zod";
import { standardEmbedInputAndQueryLLM } from "../../../../utils";
import { initPinecone } from "@/lib/pineconeHelpers";

const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
});

// POST /api/questions
export const POST = async (req: Request, res: Response) => {
    const client = await initPinecone();
    try {
        const body = await req.json();

        const { amount, topic, type, context, standard } =
            getQuestionsSchema.parse(body);

        const template = `You are a helpful AI that is able to generate ${amount} pairs of questions and answers about this specific topic: "${topic}". Base the questions 
        on this context if possible: "${context}". If there is no context just create it based what you know. The length of the answer should not exceed 15 words, store all the pairs of answers and questions in a JSON object.
                 You must format your output as a JSON value that adheres to a given "JSON Schema" instance. "JSON Schema" is a declarative language 
                 that allows you to annotate and validate JSON documents. For example, the example  "JSON Schema" instance
                  {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}} 
                  would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property 
                  semantically describes it as "a list of test words". The items within "foo" must be strings. Thus, the object {{"foo": ["bar", "baz"]}} is a 
                  well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted. 
                  Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema
                    exactly and there are no trailing commas! Here is an example: {"questions": [{"question": "What is the capital of France?", "answer": "Paris"}, {"question": "What is the capital of Spain?", "answer": "Madrid"}]}.]}`;

        const template2 = `You are a helpful AI that is able to generate ${amount} sets of mcq questions about this specific topic: "${topic}". Base the questions 
        on this context if possible: "${context}". If there is no context just create it based what you know. The length of the answer should not exceed 15 words and give three additional options for each question labeled "option1", "option2", and "option3". 
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

        let questions: any;

        if (standard === "none") {
            let res = await model.call(template2);
            res.replace(/(\w)"(\w)/g, "$1'$2");
            let resObj = JSON.parse(res);

            questions = resObj.questions;
        } else {
            console.log("Calling standards version");
            console.time("Pinecone init");

            console.timeEnd("Pinecone init");
            console.log("GOT HERE LOL");
            const text = await standardEmbedInputAndQueryLLM(
                client,
                indexName,
                body
            );
            text.replace(/(\w)"(\w)/g, "$1'$2");
            let resObj = JSON.parse(text);

            questions = resObj.questions;
        }

        return NextResponse.json(
            {
                questions,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("ERROR");
        console.log(error);
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: error.issues,
                },
                {
                    status: 400,
                }
            );
        }
    }
};
