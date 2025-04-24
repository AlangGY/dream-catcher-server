import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './src/auth/entities/user.entity';
import { Dream } from './src/dreams/entities/dream.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'dream_catcher',
  entities: [User, Dream],
  migrations: [],
  synchronize: false,
});
