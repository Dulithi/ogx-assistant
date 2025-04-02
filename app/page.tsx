"use client"

import { Message, useChat } from '@ai-sdk/react';
import { SendHorizontal } from 'lucide-react';
import PromptSuggestionsRow from './components/PromptSuggestionsRow';
import ChatBubble from './components/ChatBubble';

const Home = () => {
    const { messages, input, handleSubmit, handleInputChange, status, append } = useChat({});

    const noMessages = ! messages  || messages.length === 0;

    const handlePrompt = async ( promptText : string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: 'user',
        }

        await append(msg);

    }

    return (
        <main className="flex flex-col h-screen p-4 bg-primary">
             <h1 className=" text-center font-extrabold text-5xl m-6"><span className="bg-clip-text text-transparent bg-gradient-to-r to-gv from-gta via-gte">oGX Assistant</span></h1>
            
            <section className="flex-grow flex flex-col justify-end overflow-hidden">
                {noMessages ? (
                    <div className='flex flex-col items-center text-center p-6'>
                        <p className="text-primary-content text-lg">Clarify your doubts about the AIESEC Exchange program!</p>
                        <br />
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </div>
                ) : (
                    <div className='overflow-y-auto flex flex-col p-4 space-y-2 max-h-[65vh] rounded-xl'>
                        {messages.map((message) => (
                            <ChatBubble key={message.id} message={message} />
                        ))}
                        {status !== 'ready' && <div className='text-left'><span className="loading loading-dots loading-md text-aiesec-blue"></span></div>}
                    </div>
                )}
            </section>
            
            <div className='p-4 rounded-xl'>
                <form className="flex items-center space-x-3" onSubmit={handleSubmit}>
                    <input 
                        className="text-primary-content flex-grow p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-aiesec-blue outline-none"
                        type="text" 
                        value={input} 
                        onChange={handleInputChange} 
                        placeholder="Ask me something..."
                        disabled={status !== 'ready'}
                    />
                    <button type="submit" className="bg-aiesec-blue text-white p-3 rounded-full hover:bg-aiesec-blue transition duration-200">
                        <SendHorizontal size={20} />
                    </button>
                </form>
            </div>
        </main>
    );

}

export default Home;