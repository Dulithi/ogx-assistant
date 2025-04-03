import { Message } from "ai";
import { marked } from "marked";

const MessageList = ({messages, status} : {messages: Message[], status: string}) => {
    return (
        <section className="flex flex-col justify-end p-8 h-[85vh]">
        <div className="flex flex-col gap-4 overflow-y-scroll py-10 scroll-smooth no-scrollbar">
            
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
                    
    </div>
    </section>
  );
}

export default MessageList;

