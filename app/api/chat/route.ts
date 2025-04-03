import OpenAI from "openai";
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { DataAPIClient, SomeDoc } from "@datastax/astra-db-ts";

// Define the maximum number of tokens allowed per request to avoid excessive input sizes.
const MAX_TOKENS_PER_REQUEST = 500;

// Extract necessary environment variables.
const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env;

// Initialize OpenAI client with the provided API key.
const openai_client = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// Initialize DataStax Astra DB client for database interactions.
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

// Ensure the database endpoint is defined, otherwise throw an error.
if (!ASTRA_DB_ENDPOINT) {
    throw new Error("ASTRA_DB_ENDPOINT is not defined");
}

// Establish connection to the database.
const db = client.db(ASTRA_DB_ENDPOINT, {
    keyspace: ASTRA_DB_NAMESPACE,
});

// Handle POST requests to process user messages.
export async function POST(req: Request) {
    try {
        // Parse the JSON request body to extract user messages.
        const { messages } = await req.json();
        
        // Get the latest message from the conversation.
        const latestMessage = messages[messages.length - 1].content;

        // Estimate token count (approximately 1 token per 4 characters).
        const estimatedTokens = latestMessage.length / 4;
        
        // If the message is too long, return an error response.
        if (estimatedTokens > MAX_TOKENS_PER_REQUEST) {
            return new Response(JSON.stringify({ error: "Message too long. Please shorten your input." }), { status: 400 });
        }

        let docContext = "";

        // Generate an embedding for the latest message to perform a similarity search in the database.
        const embedding = await openai_client.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float",
        });

        try {
            // Ensure the collection name is defined.
            if (!ASTRA_DB_COLLECTION) {
                throw new Error("ASTRA_DB_COLLECTION is not defined");
            }

            // Retrieve the specified collection from the database.
            const collection = db.collection(ASTRA_DB_COLLECTION);

            // Perform a similarity search using the generated embedding.
            const cursor = collection.find({}, {
                sort: {
                    $vector: embedding.data[0].embedding, // Use vector similarity for sorting.
                },
                limit: 20 // Limit the number of retrieved documents.
            });

            // Convert retrieved documents to an array.
            const documents = await cursor.toArray();

            // Extract and store the relevant text from the retrieved documents.
            const docsMap = documents?.map((doc: SomeDoc) => (doc.text));
            
            // Convert the retrieved documents into a JSON string for further use.
            docContext = JSON.stringify(docsMap);

        } catch (error) {
            console.log("Error querying db ...", error);
            docContext = ''; // If the query fails, use an empty context.
        }

        // Define the system prompt with context from the database and user query.
        const template = {
            role: "system",
            content: `You are an AI assistant integrated into the AIESEC Sri Lanka website to help users with their questions about the AIESEC Exchange programs. 
        Your goal is to provide clear, accurate, and helpful answers about AIESEC's exchange opportunities.
        
        ###  How to Answer:
        1️⃣ **Use the provided context first** to answer questions.  
        2️⃣ If the context does **not** contain the needed information, rely on your general knowledge.  
        3️⃣ **Do NOT make up details** about exchange programs—respond with "I'm not sure" if uncertain.  
        4️⃣ Format responses in **Markdown** for readability.  
        5️⃣ **DO NOT generate images** or mention external links unless explicitly asked.  
        
        ---
        
        ### **Context from the AIESEC Database**
        Below is relevant retrieved information about AIESEC exchange programs:
        
        ${docContext}
        
        ---
        
        ### **User's Question:**
        ${latestMessage}
        
        Provide a well-structured response based on the above guidelines.`
        };
        
        // Use streaming to generate AI response based on the template and user messages.
        const result = streamText({
            model: openai("gpt-4o-mini"),
            messages: [template, ...messages],
        });

        // Consume the stream to ensure the response is processed.
        result.consumeStream();

        // Return the response as a streamed data response.
        return result.toDataStreamResponse();
      
    } catch (error) {
        console.log("Error connecting to OpenAI ...", error);
    }
}