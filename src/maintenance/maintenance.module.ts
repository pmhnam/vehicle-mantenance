import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceConfig } from './entities/maintenance-config.entity';
import { MaintenanceLog } from './entities/maintenance-log.entity';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceRepository } from './repositories/maintenance.repository';
import { MaintenanceCalculator } from './domain/maintenance-calculator';
import { MAINTENANCE_REPOSITORY } from './interfaces/maintenance.repository.interface';
import { MaintenanceProfile } from './entities/maintenance-profile.entity';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceConfig, MaintenanceLog, MaintenanceProfile]), VehicleModule],
  controllers: [MaintenanceController],
  providers: [
    MaintenanceService,
    MaintenanceCalculator,
    {
      provide: MAINTENANCE_REPOSITORY,
      useClass: MaintenanceRepository,
    },
  ],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
