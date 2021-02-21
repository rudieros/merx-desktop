import { FlowSchema } from '../_interfaces/FlowSchema';

// todo use state machine?
export const mockedFlowSchema: FlowSchema = {
  greeting: {
    start: {
      routes: [
        {
          intent: 'greetings_hello',
          fulfillmentId: 'greeting_fulfillment',
        },
      ],
    },
  },
  schedule: {
    start: {
      routes: [
        {
          intent: 'schedule_appointment',
          fulfillmentId: 'schedule_appointment_fulfillment',
          transition: {
            type: 'page',
            destinationId: 'get_appointment_info',
          },
        },
      ],
    },
    get_appointment_info: {
      entryId: 'get_appointment_info_entry',
      parameters: [
        // {
        //   parameterId: 'appointment_person_name',
        //   required: true,
        //   type: 'sys_name',
        // },
        {
          parameterId: 'appointment_person_cpf',
          type: 'sys_cpf',
        },
        // {
        //   parameterId: 'appointment_date',
        //   type: 'sys_date',
        // },
      ],
      // routes: [
      //   {
      //     intent: 'provide_name',
      //     fulfillmentId: 'provide_name_fulfillment',
      //     transition: {
      //       type: 'page',
      //       destinationId: 'get_professional_specialty',
      //     },
      //     parametersToBeExtracted: {
      //       name: {
      //         type: 'name',
      //         required: true,
      //       },
      //     },
      //     onRequiredParameterNotFoundId: {
      //       name: 'schedule_appointment_get_name_failed',
      //     },
      //   },
      // ],
    },
    get_professional_specialty: {
      entryId: 'provide_professional_specialty_entry',
      routes: [
        {
          intent: 'provide_professional_specialty',
          fulfillmentId: 'provide_professional_specialty_fulfillment',
        },
      ],
    },
  },
};
