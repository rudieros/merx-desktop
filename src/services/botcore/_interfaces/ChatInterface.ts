import { Message } from './Message';
import { MessageReplyConfig } from './MessageReplyConfig';
import { Chat } from './Chat';

export interface ChatInterface {
  id: string;
  listenIncomingToMessages(
    listener: (messages: Message[]) => Promise<void>
  ): void;
  sendMessages(
    input: Array<{
      content: Message;
      config: MessageReplyConfig;
    }>
  ): Promise<void>;
  toggleIsTyping(
    isTyping: boolean,
    chat: Chat,
    durationMillis: number
  ): Promise<void>;
  sendReadFlag(chat: Chat): Promise<void>;
}
