import React, { forwardRef, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(({ onSendMessage }, ref) => {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') {
      return;
    }
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex items-center mb-3 pt-2 w-full max-w-4xl mx-auto">
  <input
    ref={ref}
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="flex-grow break-words px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Type a message..."
  />
  <button
    onClick={handleSendMessage}
    className="p-3 ml-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-20"
  >
    Send
  </button>
</div>

    
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;