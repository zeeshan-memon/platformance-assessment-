import React from 'react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: String;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => {
  return (
    <div className={`col-start-2 col-end-12 p-3 `}>

      <div className="flex flex-row  gap-2 ">
        
          <div className={`px-4 h-10 w-10 flex items-center justify-center rounded-full 
          ${role == "user"? 'bg-indigo-300 text-black text-sm' 
          :'bg-indigo-500 text-white text-sm'}`}>

          {role === 'user' ? 'You' : 'AI'}
          </div>

        <div
          className={` p-3 text-lg rounded-xl shadow-md ${
            role === 'user'
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white rounded-bl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{content.replace(/<think>[\s\S]*?<\/think>\n?/g, '')}</p>
        </div>

      </div>
    
    </div>
  );
};

export default ChatBubble;