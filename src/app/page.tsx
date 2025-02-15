'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import NavItem from '../components/NavItem';
import { sendMessage } from '@/lib/Api';
import ChatBubble from '@/components/ChatBubble';
import Dropdown from '@/components/ui/Dropdown';

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('qwen-2.5-coder-32b');

  useEffect(() => {
    inputFieldRef.current?.focus();
    fetchChats().then((data) => {
      setChats(data.reverse());
    }).catch((error) => {
      alert(`Error fetching chats, please try again later. ${error}`);
    });
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const generateTitle = (text: string): string => {
    if (!text) return "New Chat";

  // Remove common words and split into words
  const stopWords = new Set(["the", "is", "a", "with", "to", "in", "and", "for", "on", "at", "of", "it"]);
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/) // Split by spaces
    .filter((word) => !stopWords.has(word)); // Remove common words

  return words.slice(0, 5).join(" ") + "..."; // Use first 5 words
    // return text
    //   .toLowerCase()
    //   .split(" ")
    //   .map((word, index) =>
    //     ["a", "an", "the", "of", "in", "on", "at", "to", "for", "with", "and", "but", "or"].includes(word) && index !== 0
    //       ? word
    //       : word.charAt(0).toUpperCase() + word.slice(1)
    //   )
    //   .join(" ");
  };

  const fetchChats = async (): Promise<Chat[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_ENDPOINT}/chats`);
    return response.json();
  };

  const fetchChatHistory = async (chatId: string): Promise<Message[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_ENDPOINT}/chat/${chatId}`);
    return response.json();
  };

  // const sendMessage = async (message: string, chatId: string | null): Promise<any> => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_ENDPOINT}/chat${chatId ? `?chat_id=${chatId}` : ''}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'text/plain',
  //       },
  //       body: message
  //     });
  //     return response.json();
  //   } catch (error) {
  //     console.error('Error', error);
  //   }
  // };
  const handleModel = (model: string) => {  
          setModel(model);
  }
  const handleSendMessage = (input: string) => {
    const newMessage: Message = {
      role: "user",
      content: input
    };
    const _messages = [...messages, newMessage];
    setMessages(_messages);
    scrollToBottom();
    setIsLoading(true);
    sendMessage(_messages, model, chatId).then((response) => {
      const message = response.data.choices[0].message; 
      const chat:Chat = {id:response. data.id, title:generateTitle(message.content)}; 
      if (!chatId) {
        setChats([chat, ...chats]);
      }
      setChatId(response.data.id);
      setMessages([...messages, newMessage, message]);
      scrollToBottom();
    }).catch((error) => {
      alert(`Error sending message, please try again later. ${error}`);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const openChat = (chatId: string) => {
    setChatId(chatId);
    setDrawerOpen(false);
    fetchChatHistory(chatId).then((data) => {
      setMessages(data);
      scrollToBottom();
      inputFieldRef.current?.focus();
    });
  };

  const newChat = () => {
    setChatId(null);
    setMessages([]);
    inputFieldRef.current?.focus();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50 h-16">
        <div className="flex justify-between items-center">
          <span className="p-1 font-semibold whitespace-nowrap dark:text-white">Chatbot</span>
          <Dropdown setModel={handleModel}/>
        </div>
      </nav>


      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
          {chats.length > 0 && <ul className="space-y-2">
            {chats.map((chat, index) => (
              <NavItem key={index} active={chatId === chat.id} onClick={() => openChat(chat.id)}>
                <span className="truncate text-ellipsis">
                  {chat.title}
                </span>
              </NavItem>
            ))}
          </ul>}
          <ul className={`pt-5 space-y-2 ${chats.length > 0 ? 'mt-5 border-t border-gray-200 dark:border-gray-700' : ''}`}>
            <NavItem active={!chatId} onClick={() => newChat()}>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
              </svg>
              <span className="ml-3 truncate text-ellipsis">
                New chat
              </span>
            </NavItem>
          </ul>
        </div>
      </aside>

      <main className="p-4 md:ml-64 pt-20 dark:text-white h-screen">
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full py-2 px-4">
          
          <div className="h-full overflow-x-auto mb-6">
            <ChatMessages messages={messages} />
            <div ref={messagesEndRef} />
            {isLoading && <div className=' px-2'> <ChatBubble role="assistant" content="Thinking..." /></div>}
          </div>
          <ChatInput onSendMessage={handleSendMessage} ref={inputFieldRef} />
        </div>
      </main>
    </div>
  );
};

export default App;