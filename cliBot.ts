import { BotCore } from './src/services/botcore/BotCore';
import { HumanLikeBrain } from './src/services/botcore/brains/humanlikebrain/HumanLikeBrain';
import { Chat } from './src/services/botcore/_interfaces/Chat';
import { MessageReplyConfig } from './src/services/botcore/_interfaces/MessageReplyConfig';
import { Message } from './src/services/botcore/_interfaces/Message';
import { ChatInterface } from './src/services/botcore/_interfaces/ChatInterface';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class CliChatInterface implements ChatInterface {
  id = 'cli';

  private messageSender: (input: Message[]) => Promise<void>;

  constructor() {
    this.captureMessage();
  }

  captureMessage() {
    rl.question('Digite sua mensagem: ', (answer) => {
      this.messageSender([
        {
          body: answer,
          receivedAt: new Date(),
          chat: {
            id: 'single-chat',
          },
        },
      ]);
    });
  }

  registerMessageSender(
    listener: (messages: Message[]) => Promise<void>
  ): void {
    this.messageSender = listener;
  }

  async sendMessages(
    input: Array<{ content: Message; config: MessageReplyConfig }>
  ): Promise<void> {
    console.log(input[0].content.body);
    this.captureMessage();
  }

  sendReadFlag(chat: Chat): Promise<void> {
    return Promise.resolve(undefined);
  }

  toggleIsTyping(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isTyping: boolean,
    chat: Chat,
    durationMillis: number
  ): Promise<void> {
    return Promise.resolve(undefined);
  }
}

const core = BotCore.initialize({
  brain: new HumanLikeBrain(),
  chatInterface: new CliChatInterface(),
});
