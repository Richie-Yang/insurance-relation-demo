import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PolicyHolders } from '../models';
import { CONFIG } from '../config';
import * as policyHoldersRepository from './policy-holders.repository';

let db: DataSource | undefined;

export { init, datasource };

async function init() {
  db = new DataSource({
    type: 'mysql',
    host: CONFIG.MYSQL_HOST,
    port: CONFIG.MYSQL_PORT,
    username: CONFIG.MYSQL_USER,
    password: CONFIG.MYSQL_PASSWORD,
    database: 'insurance-relation-demo',
    synchronize: true,
    logging: false,
    entities: [PolicyHolders],
    migrations: [],
    subscribers: [],
  });

  await db.initialize();
  policyHoldersRepository.setupRepo();

  return db;
}

function datasource() {
  if (!db) process.exit(1);
  return db;
}
