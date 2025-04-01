"use client"

import { useChat } from '@ai-sdk/react'

const Home = () => {
    const noMessages = true;

    const { messages, input, handleSubmit, handleInputChange, status } = useChat()

    return (
        <main>
            <h1 className="text-center font-extrabold text-5xl m-6"><span className="bg-clip-text text-transparent bg-gradient-to-r to-gv from-gta via-gte">oGX Assistant</span></h1>
            <section className={noMessages? "" : "populated"}>
                {noMessages? (
                    <>
                        <p className="text-center m-10 text-gray-500 text-lg"> Clarify your doubts about AIESEC Exchange program! </p>
                        <br/>
                        {/* <PromptSuggestionRow /> */}
                    </>
                ): (
                    <>
                        {/* map messages to text bubbles   */}
                        {/* <LoadingBubble/> */}
                    </>
                )}
                <form onSubmit={handleSubmit}>
                    <input 
                        className="input" 
                        type="text" 
                        value={input} 
                        onChange={handleInputChange} 
                        placeholder="Ask me something..."
                        disabled={status !== 'ready'}
                    />
                    <input type="submit" />
                </form>
            </section>
        </main>
    );

}

export default Home;