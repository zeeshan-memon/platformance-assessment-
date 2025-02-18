interface Message {
    role: 'user' | 'assistant';
    content: string;
    chatId:string;
}