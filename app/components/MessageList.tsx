"use client"

import { Message } from "ai";
import { marked } from "marked";
import { useEffect, useRef } from "react";

const MessageList = ({messages, status} : {messages: Message[], status: string}) => {
    // Create a ref for the scrollable container
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    // Scroll to bottom when messages change or status changes
    useEffect(() => {
        scrollToBottom()
    }, [messages, status]);
  
    return (
        <section className="flex flex-col justify-end px-8 pt-8 h-[85vh]">
        <div ref={containerRef} className="flex flex-col gap-4 overflow-y-scroll py-10 no-scrollbar">
            
        {messages.map((message) => (
            <div
            key={message.id}
            data-role={message.role}
            className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-aiesec-blue data-[role=assistant]:text-black data-[role=user]:text-white"
            >
            <div dangerouslySetInnerHTML={{ __html: marked(message.content, { breaks: true }) }} />
            </div>
      ))}
      {(status === 'submitted' ) && <div className='float-left text-aiesec-blue'><span className="loading loading-dots loading-md"></span></div>}
         {/* This empty div serves as our scroll target */}
        <div ref={messagesEndRef} />           
    </div>
    </section>
  );
}

export default MessageList;

