export interface FlowSchema {
  [flowId: string]: {
    start: DefaultStartPage;
    [pageId: string]: PageSchema;
  };
}

export type PageSchema = {
  entryId?: string;
  routes?: RouteSchema[];
  parameters?: Array<{
    parameterId: string;
    type: EntityType;
    required?: boolean;
    entryId?: string;
    fulfillmentId?: string;
    unfulfilledId?: string;
  }>;
};

export type RouteSchema = {
  intent: string;
  transition?: {
    type: 'page' | 'flow';
    destinationId: string;
  };
  fulfillmentId?: string;
  unmatchedId?: string;
  onRequiredParameterNotFoundId?: {
    [parameterId: string]: string;
  };
  parametersToBeExtracted?: {
    [parameterId: string]: {
      type: EntityType;
      required?: boolean;
    };
  };
};

export type DefaultStartPage = PageSchema;

export type EntityType = 'sys_date' | 'sys_cpf' | 'sys_person';
