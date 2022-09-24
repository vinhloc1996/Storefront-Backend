import dotenv from 'dotenv';
import { Pool, PoolConfig } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  POSTGRES_TEST_PORT,
  ENV,
} = process.env;

let config: PoolConfig = {};

if (ENV === 'test') {
  config = {
    host: POSTGRES_HOST,
    port: POSTGRES_TEST_PORT as unknown as number,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  };
}
if (ENV === 'dev') {
  config = {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT as unknown as number,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  };
}

const client = new Pool(config);
export default client;
