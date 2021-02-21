import { HumanLikeBrain } from './HumanLikeBrain';
import { Message } from '../../_interfaces/Message';
import { createHumanLikeBrainStateMachine } from './createHumanLikeBrainStateMachine';
import { DefaultNLP } from '../../nlp/DefaultNLP';
import { mockedFlowSchema } from '../../nlp/schema';
import { FlowStateMachine } from '../../nlp/FlowStateMachine';
import { Machine, assign } from 'xstate';

const exec = async () => {
  const brain = new HumanLikeBrain();
  const int = createHumanLikeBrainStateMachine(brain);
  const messages = [];
  for (let i = 0; i < 10; i++) {
    const id = Math.ceil(Math.random() * 1000);
    const message: Message = {
      chat: { id },
      body: id.toString(),
      receivedAt: new Date(),
    };
    messages.push(message);
  }
  await brain.ingestMessages(messages);
  console.log('History', JSON.stringify(int.state, null, 2));
};

jest.setTimeout(100000000000);

describe('Test', () => {
  test('ssss', async () => {
    const nlp = new DefaultNLP();
    const intent = await nlp.getIntentFromText(
      'Olá boa tarde, gostaria de marcar uma consulta pra amanhã, meu nome é Patricia'
    );
    const machine = new FlowStateMachine(
      undefined,
      {
        entities: intent.extractedEntities,
      },
      nlp
    );
    const response = await machine.getResponse(intent.id);
    expect(true).toBe(true);
  });

  test('asd', async () => {
    await exec();
    expect(true).toBe(true);
  });

  test('nlp', async () => {
    const nlp = new DefaultNLP();
    // const response1 = await nlp.getIntentFromText('dia 14 de abril, pode ser depois de amanhã? E se for amanha?');
    const response2 = await nlp.getIntentFromText(
      'João Ferreira de oliveira ou Patricia Ferreira'
    );
    expect(true).toBe(true);
  });

  test('state machine', async () => {
    const machine = new FlowStateMachine(mockedFlowSchema);
    const response1 = machine.getResponse('greetings_hello');
    const response2 = machine.getResponse('schedule_appointment');
    const response3 = machine.getResponse('provide_name', 'schedule', 'start');

    expect(machine).toBe(machine);
  });
});
