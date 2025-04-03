import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config"; 

// Define the type for similarity metrics used in vector search
type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

// Extract necessary environment variables
const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env;

// Initialize OpenAI API client for text embedding generation
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// List of URLs to scrape data from web
const oGXData = [
    'https://aiesec.org/global-teacher',
    'https://aiesec.org/global-talent',
    'https://aiesec.org/global-volunteer', 
    'https://aiesec.org/search?programmes=7',
    'https://aiesec.org/search?programmes=8',
    'https://aiesec.org/search?programmes=9',
    'https://aiesec.org/about-us',
];

// List of PDF files containing in Global AIESEC Compendium
const pdfPaths = [ 
    "./app/assets/dataFiles/apip.pdf",
    "./app/assets/dataFiles/annex_1.pdf",
    "./app/assets/dataFiles/annex_2.pdf",
    "./app/assets/dataFiles/annex_3.pdf",
    "./app/assets/dataFiles/annex_4.pdf",
    "./app/assets/dataFiles/annex_5.pdf",
    "./app/assets/dataFiles/annex_6.pdf",
    "./app/assets/dataFiles/annex_7.pdf",
    "./app/assets/dataFiles/annex_8.pdf",
    "./app/assets/dataFiles/annex_9.pdf",
    "./app/assets/dataFiles/annex_10.pdf",
    "./app/assets/dataFiles/annex_11.pdf",
    "./app/assets/dataFiles/appendix_8.pdf",
];

// Initialize AstraDB client for vector database operations
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

// Ensure the database endpoint is defined, otherwise throw an error
if (!ASTRA_DB_ENDPOINT) {
    throw new Error("ASTRA_DB_ENDPOINT is not defined in the environment variables.");
}

// Establish connection to AstraDB using the provided keyspace
const db = client.db(ASTRA_DB_ENDPOINT, {
    keyspace: ASTRA_DB_NAMESPACE,
});

// Initialize a text splitter to break large text chunks into smaller ones
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512, // Each chunk will be 512 characters long
    chunkOverlap: 100, // Overlapping characters between chunks to preserve context
});

// Function to create a new collection in AstraDB with vector search capability
const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    if (!ASTRA_DB_COLLECTION) {
        throw new Error("ASTRA_DB_COLLECTION is not defined in the environment variables.");
    }
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536, // OpenAI embedding vector size
            metric: similarityMetric, // Similarity metric for vector search
        },
    });
    console.log(res); // Log the collection creation response
};

// Function to scrape web data, split it into chunks, generate embeddings, and store them in AstraDB
const loadWebData = async () => {
    if (!ASTRA_DB_COLLECTION) {
        throw new Error("ASTRA_DB_COLLECTION is not defined in the environment variables.");
    }
    const collection = db.collection(ASTRA_DB_COLLECTION);

    for (const url of oGXData) {
        const content = await scrapePage(url); // Scrape content from the URL
        const chunks = await splitter.splitText(content); // Split content into smaller chunks

        for await (const chunk of chunks) {
            // Generate text embedding for the chunk
            const embedding = await openai.embeddings.create({ 
                model: "text-embedding-3-small", 
                input: chunk,
                encoding_format: "float",
            });

            const vector = embedding.data[0].embedding; // Extract the vector representation

            // Store the chunk with its vector representation in AstraDB
            const res = await collection.insertOne({
                $vector: vector,
                text: chunk,
            });

            console.log(res); // Log the insert response
        }
    }
};

// Function to load and process data from PDFs, generate embeddings, and store in AstraDB
const loadPDFData = async () => {
    if (!ASTRA_DB_COLLECTION) {
        throw new Error("ASTRA_DB_COLLECTION is not defined in the environment variables.");
    }
    const collection = db.collection(ASTRA_DB_COLLECTION);

    for (const filePath of pdfPaths) {
        // Load PDF file content
        const singleDocPerFileLoader = new PDFLoader(filePath, {
            splitPages: false, // Load the entire PDF as a single document
        });
        const content = await singleDocPerFileLoader.load();
        const chunks = await splitter.splitDocuments(content); // Split PDF content into smaller chunks

        for await (const chunk of chunks) {
            const chunkText = chunk.pageContent; // Extract the text content of the chunk

            // Generate text embedding for the chunk
            const embedding = await openai.embeddings.create({ 
                model: "text-embedding-3-small", 
                input: chunkText,
                encoding_format: "float",
            });

            const vector = embedding.data[0].embedding; // Extract the vector representation

            // Store the chunk with its vector representation in AstraDB
            const res = await collection.insertOne({
                $vector: vector,
                text: chunkText,
            });

            console.log(res); // Log the insert response
        }
    }
};

// Function to scrape webpage content using Puppeteer
const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true, // Run Puppeteer in headless mode (no UI)
        },
        gotoOptions: {
            waitUntil: "load", // Wait until the page fully loads before scraping
        },
        evaluate: async (page, browser) => {
            // Extract the page's HTML content
            const result = await page.evaluate(() => document.body.innerHTML);
            await browser.close(); // Close the browser after extraction
            return result;
        }
    });

    // Scrape and clean the extracted content (removing HTML tags)
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

// Run the data ingestion process sequentially: 
// 1. Create the database collection
// 2. Load and store web data
// 3. Load and store PDF data
createCollection()
    .then(() => loadWebData())
    .then(() => loadPDFData());
