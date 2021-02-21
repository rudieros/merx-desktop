import { ChatInterface } from './_interfaces/ChatInterface';
import { Brain } from './_interfaces/Brain';

const log = (...messages) => console.log('[BOT CORE]:', ...messages);

export class BotCore {
  private static instance: BotCore;

  public static initialize(config: {
    chatInterface: ChatInterface;
    brain: Brain;
  }) {
    if (!BotCore.instance) {
      BotCore.instance = new BotCore(config.chatInterface, config.brain);
    }
    return BotCore.instance;
  }

  private constructor(
    private chatInterface: ChatInterface,
    private brain: Brain
  ) {
    this.startMessageExchanges();
  }

  private startMessageExchanges() {
    this.chatInterface.listenIncomingToMessages((m) => {
      log('Messages Received from chat interface', m);
      return this.brain.ingestMessages(m);
    });
    this.brain.registerReplyingMessagesListener((content) => {
      log('Messages Sent to chat interface', content);
      return this.chatInterface.sendMessages(content);
    });
    this.brain.registerReplyingMessagesListener((content) => {
      log('Messages Sent to chat interface', content);
      return this.chatInterface.sendMessages(content);
    });
  }
}
