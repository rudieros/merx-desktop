import { interpret, Machine } from 'xstate';
import { HumanLikeBrainState as s } from './HumanLikeBrainState';
import { HumanLikeBrain } from './HumanLikeBrain';
import { HumanLikeBrainEvent as e } from './HumanLikeBrainEvents';

const TAG = `[HumanLikeBrainStateMachine]`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-ignore
export const createHumanLikeBrainStateMachine = (brain?: HumanLikeBrain) => {
  const machine = Machine(
    {
      id: 'humanLikeBrain',
      initial: s.IDLE,
      states: {
        [s.IDLE]: {
          entry: ['notify'],
          on: {
            [e.MESSAGES_RECEIVED]: s.LOOKING_FOR_MESSAGE_TO_ENGAGE,
          },
        },
        [s.LOOKING_FOR_MESSAGE_TO_ENGAGE]: {
          entry: ['notify', 'lookForMessagesToEngage'],
          on: {
            [e.FOUND_NO_MESSAGES]: s.IDLE,
            [e.ENGAGE_MESSAGE]: s.BEGINNING_ENGAGING_MESSAGE,
          },
        },
        [s.BEGINNING_ENGAGING_MESSAGE]: {
          entry: ['notify', 'engageMessage'],
          on: {
            [e.START_READING_MESSAGE]: s.READING_MESSAGE,
          },
        },
        [s.READING_MESSAGE]: {
          entry: ['notify', 'readMessage'],
          on: {
            [e.GIVE_UP_AFTER_READING_MESSAGE]: s.LOOKING_FOR_MESSAGE_TO_ENGAGE,
            [e.START_TYPING_REPLY]: s.TYPING_ANSWER,
          },
        },
        [s.TYPING_ANSWER]: {
          entry: ['notify', 'typeMessageReply'],
          on: {
            [e.FINISHED_REPLYING]: s.IDLE,
          },
        },
      },
    },
    {
      actions: {
        notify: (_, event) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          console.log(
            `${TAG} entered state ${service.state.history} for event ${event.type}`
          );
        },
        lookForMessagesToEngage: () => {
          console.log(`${TAG} looking for messages to engage`);
          return brain.lookForMessageToEngage();
        },
        engageMessage: (_, { message }) => {
          console.log(`${TAG} engaging message`);
          return brain.engageMessage(message);
        },
        readMessage: (_, { message }) => {
          console.log(`${TAG} reading message`);
          return brain.readMessage(message);
        },
        typeMessageReply: (_, { message }) => {
          console.log(`${TAG} typing message reply`);
          return brain.typeMessageReply(message);
        },
      },
    }
  );
  const service = interpret(machine);
  service.start();
  return service;
};
