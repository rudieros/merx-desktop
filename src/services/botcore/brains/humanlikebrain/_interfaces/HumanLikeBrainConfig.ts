import { HumanLikeBrainDataStore } from './HumanLikeBrainDataStore';
import { HumanLikeBrainInMemoryDataStore } from '../datastores/HumanLikeBrainInMemoryDataStore';
import { Nlp } from '../../../_interfaces/Nlp';
import { DefaultNLP } from '../../../nlp/DefaultNLP';

export type HumanLikeBrainConfig = {
  /**
   * This range is applied on top of idle times and also the time the message spends on queue.
   * Think of this config as the amount of time it takes the user to navigate to the chat on the webpage.
   */
  minTimeToEngageMessageMillis?: number;
  maxTimeToEngageMessageMillis?: number;

  /**
   * Ideal reading duration is calculated based on the number of words the text has. You can configure it with
   * 'readingTimePerWordMillis' (default is 150ms per word). On top of that a random variance is applied between
   * 0 and 'readingSpeedMaxVariancePercentage' (default is 10%).
   * You can also clamp those values with 'minReadingDurationMillis' and 'maxReadingDurationMillis'
   * (leave them undefined for no clamping)
   */
  minReadingDurationMillis?: number;
  maxReadingDurationMillis?: number;
  readingSpeedMaxVariancePercentage?: number;
  readingTimePerWordMillis?: number;

  /**
   * How often to forget to engage a message after reading it. Default is 0.05 (5% of the time)
   */
  probabilityOfSkippingMessageAfterReading?: number;

  /**
   * Ideal typing duration is calculated based on the number of characters the text has. You can configure it with
   * 'typingTimePerCharacterMillis' (default is 300ms per character). On top of that a random variance is applied between
   * 0 and 'typingSpeedMaxVariancePercentage' (default is 10%) for each character.
   * You can also clamp those values with 'minTypingDurationMillis' and 'maxTypingDurationMillis'
   * (leave them undefined for no clamping)
   */
  minTypingDurationMillis?: number;
  maxTypingDurationMillis?: number;
  typingSpeedMaxVariancePercentage?: number;
  typingTimePerCharacterMillis?: number;

  minIntervalBetweenTypingAndSendMillis?: number;
  maxIntervalBetweenTypingAndSendMillis?: number;
  /**
   * When looking for a message to interact with, the HumanLikeBrain will look for oldest messages and select one
   * randomly. If you set this to 1 it will always use the oldest message. Default is 3
   */
  oldestMessageAmount?: number;

  sessionExpirationSeconds?: number;

  dataStore?: HumanLikeBrainDataStore;

  nlp?: Nlp;
};

export const humanLikeBrainDefaultConfig: Partial<HumanLikeBrainConfig> = {
  minTimeToEngageMessageMillis: 1316,
  maxTimeToEngageMessageMillis: 6 * 1000 + 45,

  minReadingDurationMillis: 1000,
  maxReadingDurationMillis: undefined,
  readingSpeedMaxVariancePercentage: 0.1,
  readingTimePerWordMillis: 150,

  probabilityOfSkippingMessageAfterReading: 0.05,

  minTypingDurationMillis: undefined,
  maxTypingDurationMillis: undefined,
  typingSpeedMaxVariancePercentage: 0.1,
  typingTimePerCharacterMillis: 300,

  minIntervalBetweenTypingAndSendMillis: 300,
  maxIntervalBetweenTypingAndSendMillis: 6 * 1000,

  sessionExpirationSeconds: 60,

  dataStore: new HumanLikeBrainInMemoryDataStore(),

  nlp: new DefaultNLP(),
};
