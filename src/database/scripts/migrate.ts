/**
 * Migration CLI Script
 * Can run with TS (dev) or JS (prod after build)
 *
 * Usage:
 *   Dev:  ts-node -r tsconfig-paths/register src/database/scripts/migrate.ts
 *   Prod: node dist/database/scripts/migrate.js
 *
 * Commands:
 *   --revert   Revert last migration
 *   (default)  Run pending migrations
 */
import AppDataSource from '../config/data-source.js';

async function bootstrap() {
  const args = process.argv.slice(2);

  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established.');

    if (args.includes('--revert')) {
      console.log('Reverting last migration...');
      await AppDataSource.undoLastMigration();
      console.log('Migration reverted successfully!');
    } else {
      console.log('Running pending migrations...');
      const migrations = await AppDataSource.runMigrations();
      if (migrations.length === 0) {
        console.log('No pending migrations to run.');
      } else {
        console.log(`Executed ${migrations.length} migration(s):`);
        migrations.forEach((m) => console.log(`  - ${m.name}`));
      }
    }
  } catch (error) {
    console.error('Migration operation failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void bootstrap();
