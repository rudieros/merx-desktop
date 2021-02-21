import { HumanLikeBrainDataStore } from '../_interfaces/HumanLikeBrainDataStore';
import { Message } from '../../../_interfaces/Message';
import { Chat } from '../../../_interfaces/Chat';
import { Session } from '../../../_interfaces/Session';

export class HumanLikeBrainInMemoryDataStore
  implements HumanLikeBrainDataStore {
  private messagesByChatId: { [chatId: string]: Message[] } = {};

  private allMessages: Message[] = [];

  private sessionsByChat: { [chatId: string]: Session };

  saveMessage(message: MessageWithMetadata): Promise<void> {
    message.__messagesByChatIdIndex =
      this.messagesByChatId[message.chat.id]?.length || 0;
    message.__allMessagesIndex = this.allMessages.length;

    this.messagesByChatId = {
      ...this.messagesByChatId,
      [message.chat.id]: [
        ...(this.messagesByChatId[message.chat.id] || []),
        message,
      ],
    };

    if (this.allMessages.length) {
      const latestMessage = this.allMessages[this.allMessages.length - 1];
      if (latestMessage.chat.id === message.chat.id) {
        this.allMessages[this.allMessages.length - 1] = message;
      } else {
        this.allMessages.push(message);
      }
    } else {
      this.allMessages.push(message);
    }
    return Promise.resolve();
  }

  saveMessages(messages: MessageWithMetadata[]): Promise<void> {
    messages.forEach(this.saveMessage.bind(this));
    return Promise.resolve(undefined);
  }

  async getNOldestMessages(amountOfOldestMessages = 3): Promise<Message[]> {
    return this.allMessages.slice(-amountOfOldestMessages);
  }

  async markMessageAsRead(message: MessageWithMetadata): Promise<void> {
    this.allMessages[message.__allMessagesIndex].read = true;
  }

  async markMessageAsResolved(message: MessageWithMetadata): Promise<void> {
    this.allMessages.splice(message.__allMessagesIndex, 1);
  }

  async getActiveSessionForChat(chat: Chat): Promise<Session | undefined> {
    return Promise.resolve(this.sessionsByChat[chat.id]);
  }
}

interface MessageWithMetadata extends Message {
  __messagesByChatIdIndex?: number;
  __allMessagesIndex?: number;
}
