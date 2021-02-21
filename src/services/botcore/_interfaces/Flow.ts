import { Chat } from './Chat';
import { Message } from './Message';

export interface Flow {
  chat: Chat;
  context: Map<
    string,
    {
      type: string;
      value: string | number | Date;
    }
  >;
  lastMessage?: Message;
  createdAt: Date;
}
