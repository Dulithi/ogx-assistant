# oGX Assistant

## Overview

The **oGX Assistant** is an AI-powered chatbot designed to help users access information about AIESEC's exchange programs. It provides clear and structured responses based on a combination of retrieved database content and general AI knowledge. The assistant is integrated into the AIESEC Sri Lanka website and built using **Next.js**, **LangChain**, **OpenAI**, and **DataStax Astra DB**.

## Features

- **AI-powered Q&A**: Provides accurate responses to user queries about AIESEC exchange programs.
- **Embedded Knowledge Base**: Retrieves relevant context from a vector database using OpenAI embeddings.
- **Dynamic Prompt Suggestions**: Offers predefined question buttons for easier interaction.
- **Responsive UI**: Built with React and Tailwind CSS for a seamless user experience.
- **Serverless API**: Utilizes Next.js API routes for backend logic.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **AI Services**: OpenAI API (GPT-4, embeddings)
- **Database**: DataStax Astra DB (Vector Search)
- **Web Scraping & PDF Processing**: Puppeteer, LangChain PDF Loader

---

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/Dulithi/ogx-assistant.git
cd ogx-assistant
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
ASTRA_DB_NAMESPACE=YOUR_DATASTAX_KEYSPACE
ASTRA_DB_COLLECTION=YOUR_DB_COLLECTION_NAME
ASTRA_DB_ENDPOINT=YOUR_ASTRA_DB_ENDPOINT
ASTRA_DB_APPLICATION_TOKEN=YOUR_ASTRA_DB_APPLICATION_TOKEN

OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```
### 4. Seed the Database

```sh
npm run seed
```

### 5. Run the Project Locally

```sh
npm run dev
```

The application will start at `http://localhost:3000`.

### 6. Build the Project

```sh
npm run build
```

---

## Data Processing & Retrieval

### 1. **Creating the Vector Database**

- Uses DataStax Astra DB for vector-based semantic search.
- Embeds text data from AIESEC’s web pages and PDF documents.

### 2. **Fetching Relevant Context**

- User queries are converted into embeddings.
- The database is queried to find the most relevant context.
- If no relevant context is found, the assistant relies on OpenAI’s general knowledge.

### 3. **Generating Responses**

- The AI constructs structured and informative responses using Markdown formatting.
- The chatbot ensures accuracy and avoids hallucinations by prioritizing database information.

---

## Integration Instructions

To embed the oGX Assistant on the AIESEC Sri Lanka website, you can use the provided popup integration snippet. This approach allows users to open the chat assistant in a floating modal by clicking a button — similar to popular support widgets.

### Embed with a Floating Button (Popup Style)
Include the following snippet anywhere on your HTML page:

```html
<!-- Floating Chat Button & Assistant Popup -->
<!-- For full code, see: docs/integration-snippet.html -->
```

You can find the complete integration snippet here.
Just replace the placeholder `your-deployment-url` with the actual URL where your assistant is hosted (e.g., Vercel or Netlify deployment).

Once integrated, the assistant will appear in a popup when the floating 💬 button is clicked, giving users quick access to support about AIESEC's oGX programs.

---
