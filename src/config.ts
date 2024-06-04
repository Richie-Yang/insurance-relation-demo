import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.join(__dirname, '../env/.env');

export const CONFIG = (() => {
  // all environment are for CloudRun
  if (!['prod', 'dev'].includes(process.env.NODE_ENV || ''))
    dotenv.config({ path: envPath });
  if (!process.env.NODE_ENV) throw 'no env specified!';
  return {
    NODE_ENV: process.env.NODE_ENV,

    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: Number(process.env.MYSQL_PORT ?? 3306),
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,

    PORT: process.env.PORT,
  };
})();
