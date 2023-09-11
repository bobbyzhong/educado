import { PineconeClient } from "@pinecone-database/pinecone";

let pinecone: PineconeClient | null = null;

export const initPinecone = async () => {
    if (!pinecone) {
        const pinecone = new PineconeClient();
        await pinecone.init({
            apiKey: process.env.PINECONE_API_KEY || "",
            environment: process.env.PINECONE_ENVIRONMENT || "",
        });
    } else {
        console.log("Already created pincone");
    }
    return pinecone;
};
