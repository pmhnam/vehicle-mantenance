import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { MaintenanceConfig } from '../maintenance/entities/maintenance-config.entity';
import { MaintenanceProfile } from '../maintenance/entities/maintenance-profile.entity';
import { MaintenanceLog } from '../maintenance/entities/maintenance-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, MaintenanceConfig, MaintenanceProfile, MaintenanceLog])],
  providers: [SeederService],
})
export class DatabaseModule {}
