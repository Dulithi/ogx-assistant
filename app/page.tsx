"use client"

import { Message, useChat } from '@ai-sdk/react';
import { SendHorizontal } from 'lucide-react';
import PromptSuggestionsRow from './components/PromptSuggestionsRow';
import { appendClientMessage } from "ai"

const Home = () => {
    const { messages, input, handleSubmit, handleInputChange, status } = useChat();

    const noMessages = ! messages  || messages.length === 0;

    const handlePrompt = ( promptText : string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: 'user',
        }

        appendClientMessage({ messages, message: msg });
    }

    return (
        <main className="md:w-300 w-80 md:h-125 h-60 rounded-lg p-10 bg-stone-100 flex flex-col justify-between scroll-auto">
            <h1 className="text-center font-extrabold text-5xl m-6"><span className="bg-clip-text text-transparent bg-gradient-to-r to-gv from-gta via-gte">oGX Assistant</span></h1>
            <section className={noMessages? "w-full" : "h-full flex flex-col justify-end scroll-auto"}>
                {noMessages? (
                    <>
                        <p className="py-0 px-8 text-center m-2 text-gray-500 text-lg"> Clarify your doubts about AIESEC Exchange program! </p>
                        <br/>
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </>
                ): (
                    <>
                        {messages.map((message) => (
                            <div key={message.id} className={ message.role === 'user'? "chat chat-end" : "chat chat-start"}>
                                {message.parts.map((part, index) => {
                                    switch (part.type) {
                                        case "text":
                                            return(
                                            <div key={`text-message-${index}`} className={message.role === 'user'? "chat-bubble chat-bubble-primary": "chat-bubble chat-bubble-neutral"}>
                                                {part.text}
                                            </div>
                                            );
                                    }
                                })}
                                
                            </div>
                        ))}
                        {status === 'streaming'  && <div className='float-left'><span className="loading loading-dots loading-md"></span></div>}
                        
                    </>
                )}
               
            </section>
            <form className="h-10 w-full flex justify-between space-x-5" onSubmit={handleSubmit}>
                    <input 
                        className="w-full p-1" 
                        type="text" 
                        value={input} 
                        onChange={handleInputChange} 
                        placeholder="Ask me something..."
                        disabled={status !== 'ready'}
                    />
                    <button type="submit">
                        <SendHorizontal />
                    </button>
                </form>
                
        </main>
    );

}

export default Home;