import { Message } from "ai";

const ChatBubble = ({ message } : {message : Message}) => {
    return (
        <div className={ message.role === 'user'? "chat chat-end" : "chat chat-start"}>
            <div className={message.role === 'user'? "chat-bubble bg-gray-200 text-black": "chat-bubble bg-aiesec-blue"}>
                {message.content}
            </div>
        </div>
    );
}

export default ChatBubble;