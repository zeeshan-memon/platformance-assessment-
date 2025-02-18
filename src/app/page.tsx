'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import ChatBubble from '@/components/ChatBubble';
import Dropdown from '@/components/ui/Dropdown';
import { v4 as uuidv4 } from 'uuid';
import AuthPage from '@/components/AuthPage';
import Sidebar from '@/components/ui/SideBar';

const App: React.FC = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('qwen-2.5-coder-32b');
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [token, setToken] = useState<string | null>(null);

  
  const getChats = async ()=>{
    try {
      if(!token)
          return

    const res = await fetch(`/api/chat`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if(!res.ok){
      alert(data.response)
      return
    }
    setChats(data.response);
    } catch (error) {
      alert(error)
    }
  }
  useEffect(() => {
    inputFieldRef.current?.focus();
    getChats()

  }, [token]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  const setAuthModal = (type: 'login' | 'signup' | null) =>{
    setModalType(type)
  }
 
  const setAuthToken = (token: string | null) =>{
    setToken(token)
  }
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
  };

  const handleModel = (model: string) => {  
          setModel(model);
  }

  
  const handleSendMessage = async (input: string) => {
    if (!localStorage.getItem("token")) {
      setAuthModal("login");
      return;
    }
  
    const title =generateTitle(input)
    const newMessage: Message = {
      role: "user",
      content: input,
      chatId: chatId || uuidv4(), // Generate chatId if it's a new chat
    };
  
    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
    setIsLoading(true);
  
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, },
      body: JSON.stringify({
        message: newMessage,
        model: model,
        chatId: chatId, // Send existing chatId if available
        title:title,
      }),
    });
  
    if(!response.ok){
      setIsLoading(false)
      alert('something went wrong')
      return
    }
    setIsLoading(false);
  
    if (!response.body) {
      console.error("Response body is empty");
      return;
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedMessage = "";
  
    setMessages((prev) => [...prev, { role: "assistant", content: "", chatId: "" }]);
    window.scrollTo(0, 0);
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      const chunk = decoder.decode(value, { stream: true });
      accumulatedMessage += chunk;
  
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, content: accumulatedMessage } : msg
        )
      );
    }
  
    if (!chatId) {
      const newChats:Chat[] = [
        { id: newMessage.chatId, title: title, messages: [newMessage, { role: "assistant", content: accumulatedMessage, chatId: chatId ?? uuidv4(),  }] },
        ...chats,
      ];
      setChats(newChats);
      setChatId(newMessage.chatId);
    } else {
      const updatedChats:Chat[] = chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, newMessage, { role: "assistant", content: accumulatedMessage, chatId:chatId }] } : c
      );
      setChats(updatedChats);
    }
  };
  

  const openChat = async(chatId: string) => {
    try {
      setChatId(chatId);
    const res = await fetch(`/api/chat?chatId=${chatId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if(!res.ok){
      alert(data.response)
      return
    }
      
    setMessages(data.response);
    
    scrollToBottom();
    inputFieldRef.current?.focus();
    } catch (error) {
      alert(error)
    }
  };

  const newChat = () => {
    setChatId(null);
    setMessages([]);
    inputFieldRef.current?.focus();
  };

    // Logout function
    const loggedOut = () => {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('authChange')); // Custom event for state update
      setChatId(null);
      setMessages([]);
      setChats([]);
    };

  return (
    <div className="antialiased bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-2 fixed left-0 right-0 top-0 z-50 h-14">
        <div className="flex justify-between items-center">
          <span className="p-1 font-semibold whitespace-nowrap">Chatbot</span>
          <Dropdown setModel={handleModel}/>
          <AuthPage modalType={modalType} setModalType={setAuthModal} loggedOut={loggedOut} token={token} setToken={setAuthToken}/>
        </div>
      </nav>
      <Sidebar chatId={chatId} chats={chats} newChat={newChat} openChat={openChat} />

   <main className="p-4 md:ml-32 pt-20 h-screen flex justify-center items-center bg-transparent  ">
  <div className="flex flex-col w-full max-w-7xl px-4 h-full">
    <div className="h-[93%] overflow-x-auto mb-8 pb-12 no-scrollbar">
      <ChatMessages messages={messages} />
      <div ref={messagesEndRef} />
      {isLoading && (
        <div className="grid grid-cols-12 gap-y-2  pt-4">
          <ChatBubble role="assistant" content="Thinking..." />
        </div>
      )}
    </div>
    <div className="fixed bottom-0 left-0 right-0 bg-transparent py-2 px-4 z-50 md:ml-48 ">
      <ChatInput onSendMessage={handleSendMessage} ref={inputFieldRef} />
    </div>
  </div>
</main>
    </div>
  );
};

export default App;