import { Chat } from './Chat';
import { Message } from './Message';

export interface Session {
  chat: Chat;
  currentFlowId?: string;
  currentPageId?: string;
  targetFlowId?: string;
  targetPageId?: string;
  context: {
    params: {
      [parameterId: string]: {
        type: string;
        value: string | number | Date;
      };
    };
  };
  lastMessage?: Message;
  createdAt: Date;
  fulfilled: boolean;
}
