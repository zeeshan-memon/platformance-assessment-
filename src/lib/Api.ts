import axios from 'axios';

const api = axios.create({
  baseURL: process.env.base_url, // Use relative URL for Next.js API routes
});

export const sendMessage = async (messages: Message[], model: string, chatId:String|null) => {
  const response = await api.post('/api/chat', { messages, model, chatId });
  return response.data;
};

export const fetchWebsiteContent = async (url: string) => {
  const response = await api.post('/firecrawl', { url });
  return response.data;
};

export const getModels = async () => {
  const response = await api.get('/api/models');
  return response.data;
};