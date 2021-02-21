import { EntityType } from './FlowSchema';
import { Entity, Intent } from './Intent'

export interface Nlp {
  getIntentFromText(
    text: string,
  ): Promise<Intent>;

  assignEntitiesToParameters(
    entities: Entity[],
    parameters: { [paramId: string]: EntityType }
  ): { [param: string]: Entity };
}

export interface ProcessTextResponse {
  intent: string;
  sentiment: any;
  entities: Array<{
    type: EntityType;
    value: string | number | Date;
    sourceText: string;
  }>;
}
