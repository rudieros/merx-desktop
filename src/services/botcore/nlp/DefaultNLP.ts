import { Nlp, ProcessTextResponse } from '../_interfaces/Nlp';
import { NlpManager } from 'node-nlp';
import { Entity, Intent } from '../_interfaces/Intent';
import { EntityType } from '../_interfaces/FlowSchema';

export class DefaultNLP implements Nlp {
  private nlp;

  private language = 'pt';

  constructor() {
    this.nlp = new NlpManager({
      languages: ['pt'],
      forceNER: true,
      ner: { threshold: 1, builtins: [] },
    });
    this.nlp.load();
  }

  async getIntentFromText(text: string): Promise<Intent> {
    const response = await this.nlp.process(this.language, text);
    return Promise.resolve({
      id: response.intent === 'None' ? null : response.intent,
      sentiment: response.sentiment,
      extractedEntities: this.parseEntities(response),
    });
  }

  /**
   * For now this function will assign the last entity to the fitting param.
   * e.g. if the params require 'sys_person' and there are two entities of that type,
   * the last entity of that type in the entity array will be assigned to the param.
   * @param entities
   * @param parameters
   * @private
   */
  public assignEntitiesToParameters(
    entities: Entity[],
    parameters: { [paramId: string]: EntityType }
  ): { [param: string]: Entity } {
    const paramEntries = Object.entries(parameters);
    return entities.reduce((acc, entity) => {
      const assignedEntities = Object.values(acc);
      const matchedParamId = paramEntries.find(([paramId, entityType]) => {
        return (
          entityType === entity.type &&
          !assignedEntities.includes(entity) &&
          !acc[paramId]
        );
      })?.[0];
      if (matchedParamId) {
        return {
          ...acc,
          [matchedParamId]: entity,
        };
      }
      return acc;
    }, {});
  }

  private parseEntities(response: any): Entity[] {
    const sysPerson = [];
    const entities = response.entities
      // .filter((e) => e.sentiment.score >= -1)
      .map((entity) => {
        if (
          ['sys_first_name', 'sys_last_name'].includes(entity.entity) &&
          entity.accuracy > 0.9
        ) {
          const existingPerson = sysPerson[sysPerson.length - 1];
          if (!existingPerson) {
            sysPerson.push([entity]);
          } else {
            const lastRegisteredName =
              existingPerson[existingPerson.length - 1];
            const distance = Math.abs(entity.start - lastRegisteredName.end);
            if (distance <= 2) {
              existingPerson.push(entity);
            } else {
              sysPerson.push([entity]);
            }
          }
        }
        return {
          type: entity.entity,
          resolvedValue: this.resolveEntityValue(entity),
          sourceText: entity.sourceText,
        };
      });
    return [
      ...entities,
      ...sysPerson
        .sort((a, b) => b.length - a.length)
        .map((sysPersonEntity) => {
          return {
            type: 'sys_person',
            resolvedValue: sysPersonEntity.map((e) => e.utteranceText),
            sourceText: sysPersonEntity.map((e) => e.sourceText)?.join(' '),
          };
        }),
    ];
  }

  private resolveEntityValue(entity: {
    entity: string;
    value?: string;
    sourceText: string;
  }) {
    if (entity.entity.includes('sys_', 0)) {
      // todo parse date values
    }
    return entity.value || entity.sourceText;
  }
}
