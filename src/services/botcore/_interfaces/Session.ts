import { Chat } from './Chat'
import { Message } from './Message'
import { Entity } from './Intent'

export interface Session {
  chat: Chat;
  currentStateId?: string;
  targetStateId?: string;
  context: {
    params?: {
      [parameterId: string]: Entity;
    };
  };
  lastMessage?: Message;
  createdAt: Date;
  fulfilled: boolean;
}
