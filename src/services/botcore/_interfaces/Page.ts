import { EntityType } from './FlowSchema';

export interface Page {
  id: string;

  routes: Route[];
  /**
   * Not applicable for start page
   */
  entryDialogId?: string;

  fulfillmentDialogId?: string;

  parameters?: {
    [parameterId: string]: {
      type: EntityType;
      resolvedValue?: string | number | Date;
    };
  };
}

export interface Route {
  intent: string;
  transition: {
    type: 'flow' | 'page';
    destinationId: string;
  };
}
