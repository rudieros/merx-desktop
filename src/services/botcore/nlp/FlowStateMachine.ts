import { FlowSchema } from '../_interfaces/FlowSchema';
import { assign, Machine, MachineConfig, State, StateMachine } from 'xstate';
import fs from 'fs';
import { chooseRandomItemFromArray } from '../_utils/chooseRandomItemFromArray';
import { Entity } from '../_interfaces/Intent';
import { Nlp } from '../_interfaces/Nlp';

export class FlowStateMachine {
  public machine: StateMachine<any, any, any>;

  private separator = '-|-';

  private responses = [];

  private initialState = 'initial-state';

  private finalState = 'final-state';

  private paramsFilled: { [paramId: string]: Entity };

  constructor(
    private previousState = 'initial-state',
    private context: { entities?: Entity[] },
    private nlp: Nlp
  ) {
    this.buildMachine();
  }

  private buildMachine() {
    const { initialState, context, finalState } = this;
    const machineId = 'flow_state_machine';
    this.machine = Machine(
      {
        initial: initialState,
        id: machineId,
        context,
        states: {
          [initialState]: {
            on: {
              greetings_hello: 'greeting',
              schedule_appointment: 'schedule_appointment',
            },
            // exit: ['log'],
          },
          [finalState]: { type: 'final' },
          greeting: {
            exit: ['onFulfilled'],
            always: [{ target: finalState }],
            meta: {
              fulfillmentMessageId: 'greeting_fulfillment',
            },
          },
          schedule_appointment: {
            on: {
              ['*' as any]: {
                actions: assign({
                  slot: 100,
                }),
              } as any,
            },
            entry: ['onEntry'],
            exit: ['onFulfilled'],
            always: { target: finalState, cond: 'formFilled' },
            meta: {
              displayName: 'Agendamento de Consulta',
              fulfillmentMessageId: 'schedule_appointment_fulfillment',
              params: [
                {
                  id: 'patient_name',
                  displayName: 'Nome do Paciente',
                  type: 'sys_person',
                  required: true,
                  fulfillmentMessageId: 'provide_name_fulfillment',
                },
                {
                  id: 'patient_cpf',
                  displayName: 'Cpf do Paciente',
                  type: 'sys_cpf',
                  required: false,
                },
                {
                  id: 'schedule_date',
                  displayName: 'Data desejada',
                  type: 'sys_date',
                  required: true,
                  fulfillmentMessageId: 'provide_schedule_date_fulfillment',
                },
                {
                  id: 'schedule_doc_specialty',
                  displayName: 'Especialidade',
                  type: 'doc_specialties',
                  required: true,
                  fulfillmentMessageId:
                    'provide_schedule_doc_specialty_fulfillment',
                },
              ],
            },
          },
        },
      },
      {
        actions: {
          sendMessage: (context, event, meta) => {
            console.log('Entered greeting');
          },
          onFulfilled: (context, event, meta) => {
            const fulfillmentMessageId =
              meta.state?.transitions[0]?.source?.meta?.fulfillmentMessageId;
            if (fulfillmentMessageId) {
              this.registerMessage(fulfillmentMessageId);
            }
          },
          onEntry: (context, event, meta) => {
            // const fulfillmentMessageId =
            //   meta.state?.transitions[0]?.source?.meta?.fulfillmentMessageId;
            // if (fulfillmentMessageId) {
            //   this.registerMessage(fulfillmentMessageId);
            // }
          },
        },
        guards: {
          formFilled: (context, event, meta) => {
            const thisStateParams =
              meta.state.meta?.[`${machineId}.${meta.state.value}`]?.params;
            const parametersFilled = this.nlp.assignEntitiesToParameters(
              context.entities,
              thisStateParams.reduce((acc, param) => {
                return { ...acc, [param.id]: param.type };
              }, {})
            );
            this.paramsFilled = parametersFilled;
            const isFilled = thisStateParams?.every((param) => {
              const isThisParamFilled =
                (param.required && !!parametersFilled[param.id]) ||
                !param.required;
              if (!isThisParamFilled) {
                console.log('First param not filled', param.id)
                this.registerMessage(param.fulfillmentMessageId);
              }
              return isThisParamFilled;
            });
            console.log('isFilled', isFilled);
            return isFilled;
          },
        },
      }
    );
  }

  getResponse(intentId: string) {
    if (!intentId) {
      console.log(`Intent not here: ${intentId}`);
    }
    const transitionResult = this.machine.transition(
      this.previousState,
      intentId || 'mock'
    );
    transitionResult.actions.forEach((a) => {
      a.exec(transitionResult.context, transitionResult.event, {
        action: a,
        state: transitionResult,
        _event: transitionResult.event,
      });
    });
    return {
      nextState: transitionResult.value as string,
      changedState: transitionResult.changed,
      responses: this.responses,
      paramsFilled: this.paramsFilled,
      done: transitionResult.done,
    };
  }

  private registerMessage(messageId) {
    this.responses.push(this.loadResponse(messageId));
  }

  public getUnmatchedIntentResponse(flowId?: string, pageId?: string) {
    const unmatchedIntentId = 'unmatched_intent_default';
    // if (flowId && pageId) {
    //   const route = this.schema?.[flowId]?.[pageId]?.routes?.find(
    //     (r) => {
    //       return r.intent === intent;
    //     }
    //   );
    //   unmatchedIntentId = '';
    // }
    return this.loadResponse(unmatchedIntentId);
  }

  public getPageSchema(flowId: string, pageId: string) {}

  private mountStateId(flowId: string, pageId: string) {
    return `${flowId}${this.separator}${pageId}`;
  }

  private loadResponse(messageId: string) {
    const options = fs
      .readFileSync(`${process.cwd()}/trainer/responses/${messageId}`)
      .toString()
      .split(`\n`)
      .filter((s) => s !== '');
    return chooseRandomItemFromArray(options);
  }

  private unmountStateId(stateId) {
    const [flowId, pageId] = stateId.split(this.separator);
    return { flowId, pageId };
  }
}
