"use client"

import { Message, useChat } from '@ai-sdk/react';
import { SendHorizontal } from 'lucide-react';
import MessageList from './components/MessageList';
import Hero from './components/Hero';

const Home = () => {
    // useChat hook handles chat state, including messages, input, and submission actions
    const { messages, input, handleSubmit, handleInputChange, status, append } = useChat({});

    // Check if there are no messages to determine initial UI state
    const noMessages = !messages || messages.length === 0;

    // Function to handle user prompt input and append it to the chat
    const handlePrompt = async (promptText: string) => {
        const msg: Message = {
            id: crypto.randomUUID(), // Generate a unique ID for the message
            content: promptText, 
            role: 'user', 
        };

        await append(msg); // Append the message to the chat state
    };

    return (
        <main className="flex flex-col min-h-screen justify-end">
            {/* Show Hero component if there are no messages, else show chat messages */}
            {noMessages ? (
                <Hero handlePrompt={handlePrompt} />
            ) : (
                <MessageList messages={messages} status={status} />
            )}

            {/* Chat input form */}
            <form 
                className="border-aiesec-blue border-2 bg-background focus-within:ring-ring/10 
                           relative mx-10 mb-4 flex items-center rounded-3xl px-3 sm:py-1.5 py-1 sm:text-sm text-xm
                           focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
                onSubmit={handleSubmit} // Handle message submission
            >
                <input 
                    className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
                    type="text" 
                    value={input} // Bind input field to chat state
                    onChange={handleInputChange} // Update input state on change
                    placeholder="Ask me something..."
                    disabled={status !== 'ready'} // Disable input when chat is not ready
                />
                
                {/* Submit button */}
                <button 
                    type="submit" 
                    className="text-aiesec-blue p-2 rounded-full hover:bg-a-gray transition duration-200"
                >
                    <SendHorizontal size={16} /> {/* Send icon */}
                </button>
            </form>
        </main>
    );
}

export default Home;
