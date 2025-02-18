import { Message } from "./Message";

export interface Chat {
id: string;
title: string;
messages: Message[];
}