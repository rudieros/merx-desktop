import { HumanLikeBrainDataStore } from '../_interfaces/HumanLikeBrainDataStore';
import { Message } from '../../../_interfaces/Message';
import { Chat } from '../../../_interfaces/Chat';
import { Session } from '../../../_interfaces/Session';

export class HumanLikeBrainInMemoryDataStore
  implements HumanLikeBrainDataStore {
  private messagesByChatId: { [chatId: string]: Message[] } = {};

  private allMessages: Message[] = [];

  private sessionsByChat: { [chatId: string]: Session } = {};

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
    if (this.allMessages[message.__allMessagesIndex]?.read)
      this.allMessages[message.__allMessagesIndex].read = true;
  }

  async markMessageAsResolved(message: MessageWithMetadata): Promise<void> {
    this.allMessages.splice(message.__allMessagesIndex, 1);
  }

  async getActiveSessionForChat(chat: Chat): Promise<Session | undefined> {
    console.log('Sessions here', JSON.stringify(this.sessionsByChat[chat.id], null, 2))
    return this.sessionsByChat[chat.id];
  }

  async saveSession(session: Session): Promise<Session | undefined> {
    this.sessionsByChat[session.chat.id] = session;
    console.log('Sessions after saving', JSON.stringify(this.sessionsByChat, null, 2))
    return Promise.resolve(session);
  }

  async deleteSession(session: Session): Promise<boolean> {
    delete this.sessionsByChat[session.chat.id];
    return true;
  }
}

interface MessageWithMetadata extends Message {
  __messagesByChatIdIndex?: number;
  __allMessagesIndex?: number;
}
