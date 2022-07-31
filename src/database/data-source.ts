import 'reflect-metadata';
import { DataSource } from 'typeorm';
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['src/database/entities/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
});

AppDataSource.initialize();

export default AppDataSource;
