interface Message {
    role: 'user' | 'assistant';
    content: String;
    chatId:string;
}