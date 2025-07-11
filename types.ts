export enum Sender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface ChatMessageFile {
  name: string;
  type: string; // MIME type
  base64Data: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  file?: ChatMessageFile;
  groundingMetadata?: any;
}

export interface ChatSummary {
  id: string;
  title: string;
  createdAt: number;
}