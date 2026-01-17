import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../vehicle/entities/vehicle.entity.js';
import { MaintenanceConfig } from '../maintenance/entities/maintenance-config.entity.js';
import { MaintenanceProfile } from '../maintenance/entities/maintenance-profile.entity.js';
import { MaintenanceLog } from '../maintenance/entities/maintenance-log.entity.js';

/**
 * Database module - provides TypeORM repositories for entities
 * Note: Seeders are now in a separate SeedModule for CLI usage
 */
@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, MaintenanceConfig, MaintenanceProfile, MaintenanceLog])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
