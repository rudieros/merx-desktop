import { Brain } from '../../_interfaces/Brain';
import { Message } from '../../_interfaces/Message';
import { MessageReplyConfig } from '../../_interfaces/MessageReplyConfig';
import {
  HumanLikeBrainConfig,
  humanLikeBrainDefaultConfig,
} from './_interfaces/HumanLikeBrainConfig';
import { HumanLikeBrainDataStore } from './_interfaces/HumanLikeBrainDataStore';
import { createHumanLikeBrainStateMachine } from './createHumanLikeBrainStateMachine';
import { HumanLikeBrainEvent as e } from './HumanLikeBrainEvents';
import { getRandomBetweenInterval } from '../../_utils/getRandomBetweenInterval';
import { getTimer } from '../../_utils/getTimer';
import { clamp } from '../../_utils/clamp';
import { Session } from '../../_interfaces/Session';
import { Chat } from '../../_interfaces/Chat';
import { Nlp } from '../../_interfaces/Nlp';
import { FlowStateMachine } from '../../nlp/FlowStateMachine';
import { mockedFlowSchema } from '../../nlp/schema';

// const { log, error } = getLogger('[HumanLikeBrain] ');

export class HumanLikeBrain implements Brain {
  private store: HumanLikeBrainDataStore;

  private nlp: Nlp;

  // @ts-ignore
  private replyListener: (
    input: Array<{ content: Message; config: MessageReplyConfig }>
  ) => Promise<void>;

  private markMessageAsReadListener: (input: Message) => Promise<void>;

  private toggleIsTypingListener: (
    message: Message,
    duration: number,
    isTyping: boolean
  ) => Promise<void>;

  private interpreter = createHumanLikeBrainStateMachine(this);

  private DEFAULT_AMOUNT_OF_OLD_MESSAGES = 3;

  constructor(private readonly config?: HumanLikeBrainConfig) {
    this.config = {
      ...humanLikeBrainDefaultConfig,
      ...(this.config || {}),
    };
    this.nlp = this.config.nlp;
    this.store = this.config.dataStore;
  }

  async ingestMessages(messages: Message[]): Promise<void> {
    await this.store.saveMessages(messages);
    this.interpreter.send(e.MESSAGES_RECEIVED);
  }

  registerReplyingMessagesListener(
    listener: (
      input: Array<{ content: Message; config: MessageReplyConfig }>
    ) => Promise<void>
  ): void {
    this.replyListener = listener;
  }

  registerMarkMessageAsReadListener(
    listener: (message: Message) => Promise<void>
  ): void {
    this.markMessageAsReadListener = listener;
  }

  registerToggleIsTypingListener(
    listener: (
      message: Message,
      duration: number,
      isTyping: boolean
    ) => Promise<void>
  ): void {
    this.toggleIsTypingListener = listener;
  }

  public async lookForMessageToEngage() {
    const oldestMessageToInteract = await this.getRandomOldMessageToInteract();
    if (!oldestMessageToInteract) {
      this.interpreter.send(e.FOUND_NO_MESSAGES);
      return;
    }
    this.interpreter.send({
      type: e.ENGAGE_MESSAGE,
      message: oldestMessageToInteract,
    });
  }

  private async getRandomOldMessageToInteract(): Promise<Message | undefined> {
    const oldestMessages = await this.store.getNOldestMessages(
      this.config.oldestMessageAmount || this.DEFAULT_AMOUNT_OF_OLD_MESSAGES
    );
    if (!oldestMessages.length) {
      return undefined;
    }
    const randomIndex = Math.ceil(oldestMessages.length * Math.random()) - 1;
    return oldestMessages[randomIndex];
  }

  public async engageMessage(message: Message) {
    const timeToWaitToEngageMillis = getRandomBetweenInterval(
      this.config.minTimeToEngageMessageMillis,
      this.config.maxTimeToEngageMessageMillis
    );
    await getTimer(timeToWaitToEngageMillis);
    this.interpreter.send({ type: e.START_READING_MESSAGE, message });
  }

  public async readMessage(message: Message) {
    if (!message.read) {
      await Promise.all([
        this.store.markMessageAsRead(message),
        this.markMessageAsReadListener(message),
      ]);
    }
    const shouldSkipThisMessage =
      !message.read &&
      Math.random() < this.config.probabilityOfSkippingMessageAfterReading;
    if (shouldSkipThisMessage) {
      this.interpreter.send(e.GIVE_UP_AFTER_READING_MESSAGE);
      return;
    }
    const wordCount = message.body.split(' ').length;
    const readingDuration =
      wordCount *
      this.config.readingTimePerWordMillis *
      (1 + this.config.readingSpeedMaxVariancePercentage * Math.random());
    const timeToReadMessage = clamp(
      readingDuration,
      this.config.minReadingDurationMillis,
      this.config.maxReadingDurationMillis
    );
    await getTimer(timeToReadMessage);
    this.interpreter.send(e.START_TYPING_REPLY);
  }

  public async typeMessageReply(message: Message) {
    let session = await this.store.getActiveSessionForChat(message.chat);
    if (!session || this.checkSessionExpired(session)) {
      session = this.buildFreshSessionForMessage(message);
    }
    const resolvedIntent = await this.nlp.getIntentFromText(message.body);

    const stateMachine = new FlowStateMachine(
      undefined,
      { entities: resolvedIntent.extractedEntities },
      this.nlp
    );
    const response = stateMachine.getResponse(resolvedIntent.id);

    // if (!resolvedIntent.id) {
    //   // todo get unmatched response and verify mandatory params
    //   textResponse = this.flowStateMachine.getUnmatchedIntentResponse(
    //     session.targetFlowId,
    //     session.targetPageId
    //   );
    // } else {
    //
    // }
    this.toggleIsTypingListener(message);
  }

  private checkSessionExpired(session: Session) {
    return (
      Date.now() - session.createdAt.getDate() >
      this.config.sessionExpirationSeconds * 1000
    );
  }

  private buildFreshSessionForMessage(message: Message): Session {
    return {
      chat: message.chat,
      context: {},
      lastMessage: message,
      fulfilled: false,
      createdAt: new Date(),
    };
  }
}
