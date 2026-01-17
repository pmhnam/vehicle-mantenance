import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../../../vehicle/entities/vehicle.entity.js';
import { MaintenanceProfile } from '../../../maintenance/entities/maintenance-profile.entity.js';
import { ISeeder } from '../seeder.interface.js';
import { VEHICLE_SEEDS } from '../data/index.js';

@Injectable()
export class VehicleSeeder implements ISeeder {
  readonly order = 3;
  readonly name = 'VehicleSeeder';
  private readonly logger = new Logger(VehicleSeeder.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(MaintenanceProfile)
    private readonly profileRepo: Repository<MaintenanceProfile>,
  ) {}

  async run(): Promise<void> {
    for (const data of VEHICLE_SEEDS) {
      const exists = await this.vehicleRepo.findOne({ where: { licensePlate: data.licensePlate } });
      if (exists) {
        this.logger.log(`Vehicle ${data.licensePlate} already exists, skipping...`);
        continue;
      }

      const profile = await this.profileRepo.findOne({ where: { code: data.profileCode } });
      if (!profile) {
        this.logger.warn(`Profile ${data.profileCode} not found, skipping vehicle...`);
        continue;
      }

      const vehicle = this.vehicleRepo.create({
        name: data.name,
        licensePlate: data.licensePlate,
        initialOdo: data.initialOdo,
        currentOdo: data.currentOdo,
        purchaseDate: data.purchaseDate,
        profileId: profile.id,
      });
      await this.vehicleRepo.save(vehicle);
      this.logger.log(`Created vehicle: ${vehicle.name} (${vehicle.licensePlate})`);
    }
  }

  async reset(): Promise<void> {
    const result = await this.vehicleRepo.createQueryBuilder().delete().execute();
    this.logger.log(`Deleted ${result.affected} vehicles`);
  }
}
