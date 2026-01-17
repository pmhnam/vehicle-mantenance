/**
 * Seed CLI Script
 * Can run with TS (dev) or JS (prod after build)
 *
 * Usage:
 *   Dev:  ts-node -r tsconfig-paths/register src/database/scripts/seed.ts
 *   Prod: node dist/database/scripts/seed.js
 *
 * Commands:
 *   --reset    Reset all seeded data
 *   (default)  Run seeders
 */
import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../seeds/seed.module.js';
import { SeedRunnerService } from '../seeds/seed-runner.service.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['log', 'error', 'warn'],
  });

  const seedRunner = app.get(SeedRunnerService);
  const args = process.argv.slice(2);

  try {
    if (args.includes('--reset')) {
      await seedRunner.resetAll();
    } else {
      await seedRunner.runAll();
    }
  } catch (error) {
    console.error('Seed operation failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

void bootstrap();
