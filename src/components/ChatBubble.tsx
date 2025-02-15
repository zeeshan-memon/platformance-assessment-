import React from 'react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: String;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => {
  return (
    <div className={`col-start-1 col-end-8 p-3 `}>

      <div className={`flex flex-col `}>
        <div className={`flex items-center justify-center h-10 w-10 text-sm rounded-full ${role === 'user' ? 'bg-indigo-300' : 'bg-indigo-500'} flex-shrink-0`}>
          {role === 'user' ? 'You' : 'AI'}
    </div>

    <div className={` mt-1 `}>
          <div className={`whitespace-pre-wrap text-lg text-black dark:text-white  px-2`}>
            {content.replace(/<think>[\s\S]*?<\/think>\n?/g, '')}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatBubble;