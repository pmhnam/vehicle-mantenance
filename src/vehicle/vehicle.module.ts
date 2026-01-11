import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from './repositories/vehicle.repository';
import { VEHICLE_REPOSITORY } from './interfaces/vehicle.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [
    VehicleService,
    {
      provide: VEHICLE_REPOSITORY,
      useClass: VehicleRepository,
    },
  ],
  exports: [VehicleService, VEHICLE_REPOSITORY],
})
export class VehicleModule {}
