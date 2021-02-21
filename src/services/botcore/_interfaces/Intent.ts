import { EntityType } from './FlowSchema';

export interface Intent {
  id: string;
  sentiment: any;
  extractedEntities: Entity[]
}

export interface Entity {
  type: EntityType;
  resolvedValue?: any;
  sourceText: string;
}
