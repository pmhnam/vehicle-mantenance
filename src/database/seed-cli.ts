import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  process.env.RUN_SEEDER = 'true';
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seederService = app.get(SeederService);

  const command = process.argv[2];

  if (command === 'reset') {
    await seederService.resetSeededData();
  } else if (command === 'run') {
    // Force run seeder
    await seederService.onModuleInit();
  } else {
    console.log('Usage: npx ts-node src/database/seed-cli.ts [run|reset]');
  }

  await app.close();
}

void bootstrap();
