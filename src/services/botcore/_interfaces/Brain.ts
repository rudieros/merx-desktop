import { Message } from './Message';
import { MessageReplyConfig } from './MessageReplyConfig';

export interface Brain {
  ingestMessages(messages: Message[]): Promise<void>;
  registerReplyingMessagesListener(
    listener: (
      input: Array<{
        content: Message;
        config: MessageReplyConfig;
      }>
    ) => Promise<void>
  ): void;
  registerToggleIsTypingListener(
    listener: (
      message: Message,
      duration: number,
      isTyping: boolean
    ) => Promise<void>
  ): void;
  registerMarkMessageAsReadListener(
    listener: (message: Message) => Promise<void>
  ): void;
}
