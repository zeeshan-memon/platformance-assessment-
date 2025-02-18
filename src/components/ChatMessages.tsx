import React from 'react';
import ChatBubble from './ChatBubble';

interface Message {
  role: 'user' | 'assistant';
  content: String,
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="grid grid-cols-12 gap-y-2 ">
      {messages.map((message, index) => (
        <ChatBubble key={index} role={message.role} content={message.content} />
      ))}
    </div>
  );
};

export default ChatMessages;