import OpenAI from "openai";
import { DataAPIClient, SomeDoc } from "@datastax/astra-db-ts";

const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env;


const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

if (!ASTRA_DB_ENDPOINT) {
    throw new Error("ASTRA_DB_ENDPOINT is not defined");
}

const db = client.db(ASTRA_DB_ENDPOINT, {
    keyspace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
    try {
        const {messages} = await req.json();
        const latestMessages = messages[messages.length - 1].content;
        let docContext = "";
        const embedding = await  openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessages,
            encoding_format: "float",
        })

        try {
            if (!ASTRA_DB_COLLECTION) {
                throw new Error("ASTRA_DB_COLLECTION is not defined");
            }
            const collection = db.collection(ASTRA_DB_COLLECTION);
            const cursor = collection.find({}, {
                sort: {
                    $vector	: embedding.data[0].embedding,
                },
                limit: 10
            });

            const documents = await cursor.toArray();
            const docsMap = documents?.map((doc: SomeDoc) => (doc.text));
            
            docContext = JSON.stringify(docsMap);

        } catch (error) {
            console.log("Error querying db ...", error);
            docContext = '';
        }

        const template = {
            role : 'system',
            content: `You are an assistant that helps users with their doubts about AIESEC Exchange program. 
            The context will provide you with information about AIESEC exchange opportunities. 
            If the context doesn't include the information you need, answer based on your existing knowledge and 
            don't mention what the context does or doesn't include. Format responses using markdown where applicable and don't return images.
            ------------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            ------------------
            QUESTION: ${latestMessages}
            ------------------`
        }

        const response = await openai.responses.create({
            model: "gpt-4o-mini",
            stream: true,
            input: [template, ...messages],
        });

        return response;

        // const reault = streamText({
        //     model: openai("gpt-4o-mini",
        //     prompt: template,
        // })

        

            

    }catch (error) {
        console.log("Error connecting to OpenAI ...", error);
    }
}