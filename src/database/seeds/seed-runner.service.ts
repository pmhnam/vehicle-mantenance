import { Injectable, Logger } from '@nestjs/common';
import { ISeeder } from './seeder.interface.js';
import { ProfileSeeder } from './seeders/profile.seeder.js';
import { ConfigSeeder } from './seeders/config.seeder.js';
import { VehicleSeeder } from './seeders/vehicle.seeder.js';

@Injectable()
export class SeedRunnerService {
  private readonly logger = new Logger(SeedRunnerService.name);
  private readonly seeders: ISeeder[];

  constructor(profileSeeder: ProfileSeeder, configSeeder: ConfigSeeder, vehicleSeeder: VehicleSeeder) {
    // Sort seeders by order
    this.seeders = [profileSeeder, configSeeder, vehicleSeeder].sort((a, b) => a.order - b.order);
  }

  /**
   * Run all seeders in order
   */
  async runAll(): Promise<void> {
    this.logger.log('Starting database seeding...');
    for (const seeder of this.seeders) {
      this.logger.log(`Running ${seeder.name}...`);
      await seeder.run();
    }
    this.logger.log('Database seeding completed!');
  }

  /**
   * Reset all seeded data (reverse order)
   */
  async resetAll(): Promise<void> {
    this.logger.log('Resetting seeded data...');
    const reversedSeeders = [...this.seeders].reverse();
    for (const seeder of reversedSeeders) {
      this.logger.log(`Resetting ${seeder.name}...`);
      await seeder.reset();
    }
    this.logger.log('Reset completed!');
  }
}
