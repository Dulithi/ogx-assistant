import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean" ;

const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY 
} = process.env;

console.log(OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const oGXData = [
    'https://aiesec.org/global-teacher',
    'https://aiesec.org/global-talent',
    'https://aiesec.org/global-volunteer', 
    'https://aiesec.org/search?programmes=7',
    'https://aiesec.org/search?programmes=8',
    'https://aiesec.org/search?programmes=9',
    'https://aiesec.org/about-us',
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

if (!ASTRA_DB_ENDPOINT) {
    throw new Error("ASTRA_DB_ENDPOINT is not defined in the environment variables.");
}

const db = client.db(ASTRA_DB_ENDPOINT, {
    keyspace: ASTRA_DB_NAMESPACE,
});

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100,
});

const createCollection = async (similarityMetric : SimilarityMetric = "dot_product") => {
    if (!ASTRA_DB_COLLECTION) {
        throw new Error("ASTRA_DB_COLLECTION is not defined in the environment variables.");
    }
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536,
            metric: similarityMetric,
        },
    });
    console.log(res);
}
  
const loadSampleData = async () => {
    if (!ASTRA_DB_COLLECTION) {
        throw new Error("ASTRA_DB_COLLECTION is not defined in the environment variables.");
    }
    const collection = await db.collection(ASTRA_DB_COLLECTION);

    for (const url of oGXData) {
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
        for await ( const chunk of chunks) {
            const embedding = await openai.embeddings.create({ 
                model: "text-embedding-3-small", 
                input: chunk,
                encoding_format: "float",
            });

            const vector = embedding.data[0].embedding;

            const res = await collection.insertOne({
                $vector : vector,
                text: chunk,
            });

            console.log(res);

        }
    }
} 

const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true,
        },
        gotoOptions: {
            waitUntil: "load",
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML);
            await browser.close();
            return result;
        }
    })

    return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
}

createCollection().then(() => loadSampleData());