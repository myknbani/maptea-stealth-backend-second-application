import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { PostgreSqlOptions } from '@mikro-orm/postgresql/PostgreSqlMikroORM';
import { Logger } from '@nestjs/common';
import { CustomMigrationGenerator } from './custom-migration-generator';
import { DataloaderType, MikroORM } from '@mikro-orm/core';

const additionalOptions: PostgreSqlOptions = {};

// TODO: find a more robust way to check if running in CLI, path in Docker and local different too-
if (process.argv.some((arg) => arg.includes('mikro-orm'))) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is missing.');
  }

  additionalOptions.clientUrl = databaseUrl;
}

const logger = new Logger(MikroORM.name);
export default defineConfig({
  driver: PostgreSqlDriver, // https://github.com/mikro-orm/nestjs/pull/204
  ...additionalOptions,
  extensions: [EntityGenerator, Migrator, SeedManager],
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dataloader: DataloaderType.COLLECTION,
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  migrations: {
    generator: CustomMigrationGenerator,
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
    disableForeignKeys: false,
  },
  logger: (message: string) => {
    // this setting will only be respected if "spread" in .forRoot({...})
    logger.debug(message);
  },
  seeder: {
    defaultSeeder: 'MapteaEmptyTablesSeeder',
    path: './dist/database/seeds',
    pathTs: './src/database/seeds',
    glob: '**/*.seeder.{js,ts}',
  },
  driverOptions: {
    connection: {
      // SSL issues with self-signed certs
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
  },
});
