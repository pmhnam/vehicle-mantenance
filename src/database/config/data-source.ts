import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

// Auto-detect runtime: when this file is loaded as .js it lives under dist/,
// when loaded as .ts (ts-node) it lives under src/. Resolve entity/migration
// globs relative to this file so the script works in both modes without
// requiring NODE_ENV to be set.
const isCompiled = __filename.endsWith('.js');
const ext = isCompiled ? 'js' : 'ts';

// data-source.(ts|js) lives at <root>/(src|dist)/database/config/, so go up
// 3 levels to reach the source/dist root.
const rootDir = join(__dirname, '..', '..', '..');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'vehicle_maintenance',
  entities: [join(rootDir, `**/*.entity.${ext}`)],
  migrations: [join(rootDir, `database/migrations/*.${ext}`)],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
