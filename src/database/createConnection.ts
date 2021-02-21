import { createConnection, getConnection, getConnectionManager } from 'typeorm';
import Flow from '../entities/Flow';
import FlowTemplate from '../entities/FlowTemplate.entity';

export const createDatabaseConnection = async () => {
  if (getConnectionManager().connections.length) {
    return Promise.resolve(getConnection());
  }
  console.log('Creating new connection');
  return createConnection({
    type: 'better-sqlite3',
    database: '../database.db',
    entities: [Flow, FlowTemplate],
    logging: true,
  });
};
