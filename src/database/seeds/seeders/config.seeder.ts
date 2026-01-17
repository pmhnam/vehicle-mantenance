import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceConfig } from '../../../maintenance/entities/maintenance-config.entity.js';
import { MaintenanceProfile } from '../../../maintenance/entities/maintenance-profile.entity.js';
import { ISeeder } from '../seeder.interface.js';
import { CONFIG_SEEDS } from '../data/index.js';

@Injectable()
export class ConfigSeeder implements ISeeder {
  readonly order = 2;
  readonly name = 'ConfigSeeder';
  private readonly logger = new Logger(ConfigSeeder.name);

  constructor(
    @InjectRepository(MaintenanceConfig)
    private readonly configRepo: Repository<MaintenanceConfig>,
    @InjectRepository(MaintenanceProfile)
    private readonly profileRepo: Repository<MaintenanceProfile>,
  ) {}

  async run(): Promise<void> {
    for (const [profileCode, configs] of Object.entries(CONFIG_SEEDS)) {
      const profile = await this.profileRepo.findOne({ where: { code: profileCode } });
      if (!profile) {
        this.logger.warn(`Profile ${profileCode} not found, skipping configs...`);
        continue;
      }

      // Check if configs already exist for this profile
      const existingCount = await this.configRepo.count({ where: { profileId: profile.id } });
      if (existingCount > 0) {
        this.logger.log(`Configs for ${profileCode} already exist, skipping...`);
        continue;
      }

      for (const data of configs) {
        const config = this.configRepo.create({
          itemName: data.itemName,
          maintenanceType: data.type,
          intervalKm: data.intervalKm,
          intervalMonths: data.intervalMonths,
          profileId: profile.id,
        });
        await this.configRepo.save(config);
      }
      this.logger.log(`Created ${configs.length} configs for profile: ${profileCode}`);
    }
  }

  async reset(): Promise<void> {
    const result = await this.configRepo.createQueryBuilder().delete().execute();
    this.logger.log(`Deleted ${result.affected} maintenance configs`);
  }
}
