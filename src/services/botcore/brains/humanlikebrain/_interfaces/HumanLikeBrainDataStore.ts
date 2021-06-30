import { Message } from '../../../_interfaces/Message';
import { Chat } from '../../../_interfaces/Chat';
import { Session } from '../../../_interfaces/Session';

export interface HumanLikeBrainDataStore {
  saveMessage(message: Message): Promise<void>;
  saveMessages(messages: Message[]): Promise<void>;

  /**
   * This method should return the oldest messages available for consumption
   * To ensure the correct behaviour, this method should return messages of different chat ids.
   * @param amountOfOldestMessages
   */
  getNOldestMessages(amountOfOldestMessages: number): Promise<Message[]>;

  /**
   * Use this when a message should no longer be visible by 'getNOldestMessages'
   * @param message: the message to mark as read
   */
  markMessageAsRead(message: Message): Promise<void>;

  /**
   * Use this when a message should no longer be visible by 'getNOldestMessages'
   * @param message: the message to mark as read
   */
  markMessageAsResolved(message: Message): Promise<void>;

  getActiveSessionForChat(chat: Chat): Promise<Session | undefined>;

  saveSession(session: Session): Promise<Session | undefined>;

  deleteSession(session: Session): Promise<boolean>;
}
