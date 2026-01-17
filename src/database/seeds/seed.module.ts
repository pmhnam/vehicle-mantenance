import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../config/data-source.js';
import { Vehicle } from '../../vehicle/entities/vehicle.entity.js';
import { MaintenanceConfig } from '../../maintenance/entities/maintenance-config.entity.js';
import { MaintenanceProfile } from '../../maintenance/entities/maintenance-profile.entity.js';
import { MaintenanceLog } from '../../maintenance/entities/maintenance-log.entity.js';
import { SeedRunnerService } from './seed-runner.service.js';
import { ProfileSeeder, ConfigSeeder, VehicleSeeder } from './seeders/index.js';

/**
 * Standalone module for seeding - used by CLI
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Vehicle, MaintenanceConfig, MaintenanceProfile, MaintenanceLog]),
  ],
  providers: [SeedRunnerService, ProfileSeeder, ConfigSeeder, VehicleSeeder],
  exports: [SeedRunnerService],
})
export class SeedModule {}
