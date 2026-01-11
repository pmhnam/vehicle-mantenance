import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { MaintenanceConfig } from '../maintenance/entities/maintenance-config.entity';
import { MaintenanceType } from '../maintenance/domain/maintenance-type.enum';
import {
  HONDA_AIRBLADE_HCM_CONFIGS,
  HONDA_VARIO_HCM_CONFIGS,
  OTHER_SCOOTER_CONFIGS,
} from '../maintenance/domain/maintenance.constants';

import { MaintenanceProfile } from '../maintenance/entities/maintenance-profile.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(MaintenanceConfig)
    private readonly configRepo: Repository<MaintenanceConfig>,
    @InjectRepository(MaintenanceProfile)
    private readonly profileRepo: Repository<MaintenanceProfile>,
  ) {}

  async onModuleInit() {
    if (process.env.RUN_SEEDER !== 'true') {
      return;
    }

    this.logger.log('Running database seeder...');

    // 1. Create Profiles and Configs
    const profile = await this.seedProfileAndConfigs();

    // 2. Create Vehicle linked to Profile
    await this.seedVehicles(profile);

    this.logger.log('Seeding completed!');
  }

  private async seedProfileAndConfigs(): Promise<MaintenanceProfile> {
    // Define profiles to seed
    const profilesToSeed = [
      {
        code: 'HONDA_AIRBLADE_HCM_SEVERE',
        name: 'Honda Airblade (HCM - Severe)',
        description: 'Lịch bảo dưỡng cho điều kiện khắc nghiệt tại TP.HCM',
        configs: HONDA_AIRBLADE_HCM_CONFIGS,
      },
      {
        code: 'HONDA_VARIO_HCM_SEVERE',
        name: 'Honda Vario/Click (HCM - Severe)',
        description: 'Lịch bảo dưỡng Vario/Click điều kiện TP.HCM',
        configs: HONDA_VARIO_HCM_CONFIGS,
      },
      {
        code: 'GENERIC_SCOOTER_HCM',
        name: 'Tay ga phổ thông (Vision/Lead)',
        description: 'Lịch bảo dưỡng chung cho xe tay ga Honda tại TP.HCM',
        configs: OTHER_SCOOTER_CONFIGS,
      },
    ];

    let defaultProfile: MaintenanceProfile | null = null;

    for (const p of profilesToSeed) {
      let profile = await this.profileRepo.findOne({ where: { code: p.code } });

      if (!profile) {
        profile = this.profileRepo.create({
          code: p.code,
          name: p.name,
          description: p.description,
        });
        await this.profileRepo.save(profile);
        this.logger.log(`Created Profile: ${profile.name}`);

        // Seed Configs
        for (const data of p.configs) {
          const config = this.configRepo.create({
            itemName: data.itemName,
            maintenanceType: data.type,
            intervalKm: data.intervalKm,
            intervalMonths: data.intervalMonths,
            profileId: profile.id,
          });
          await this.configRepo.save(config);
        }
        this.logger.log(`Created configs for ${profile.name}`);
      } else {
        this.logger.log(`Profile ${profile.name} already exists`);
      }

      if (p.code === 'HONDA_AIRBLADE_HCM_SEVERE') {
        defaultProfile = profile;
      }
    }

    return defaultProfile as MaintenanceProfile; // Return default for vehicle seeding
  }

  private async seedVehicles(profile: MaintenanceProfile) {
    const count = await this.vehicleRepo.count();
    if (count > 0) {
      this.logger.log('Vehicles already seeded, skipping...');
      return;
    }

    const vehicle = this.vehicleRepo.create({
      name: 'Honda Airblade 2024',
      licensePlate: '59A1-12345',
      initialOdo: 0,
      currentOdo: 0,
      purchaseDate: new Date('2024-01-15'),
      profileId: profile.id, // Link to Profile
    });
    await this.vehicleRepo.save(vehicle);
    this.logger.log(`Created vehicle: ${vehicle.name}`);
  }

  /**
   * Reset seeded data - call this to clear all seeded data
   */
  async resetSeededData() {
    this.logger.log('Resetting seeded data...');

    // Delete configs first (foreign key constraint)
    const deletedConfigs = await this.configRepo.createQueryBuilder().delete().execute();
    this.logger.log(`Deleted ${deletedConfigs.affected} maintenance configs`);

    // Delete vehicles
    const deletedVehicles = await this.vehicleRepo.createQueryBuilder().delete().execute();
    this.logger.log(`Deleted ${deletedVehicles.affected} vehicles`);

    // Delete profiles
    const deletedProfiles = await this.profileRepo.createQueryBuilder().delete().execute();
    this.logger.log(`Deleted ${deletedProfiles.affected} profiles`);

    this.logger.log('Reset completed!');
  }
}
