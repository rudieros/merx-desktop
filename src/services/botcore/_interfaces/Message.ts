import { Chat } from './Chat';

export interface Message {
  chat: Chat;
  body: string;
  receivedAt: Date;
  read?: boolean;
}
