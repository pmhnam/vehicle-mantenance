import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceProfile } from '../../../maintenance/entities/maintenance-profile.entity.js';
import { ISeeder } from '../seeder.interface.js';
import { PROFILE_SEEDS } from '../data/index.js';

@Injectable()
export class ProfileSeeder implements ISeeder {
  readonly order = 1;
  readonly name = 'ProfileSeeder';
  private readonly logger = new Logger(ProfileSeeder.name);

  constructor(
    @InjectRepository(MaintenanceProfile)
    private readonly profileRepo: Repository<MaintenanceProfile>,
  ) {}

  async run(): Promise<void> {
    for (const data of PROFILE_SEEDS) {
      const exists = await this.profileRepo.findOne({ where: { code: data.code } });
      if (!exists) {
        const profile = this.profileRepo.create(data);
        await this.profileRepo.save(profile);
        this.logger.log(`Created profile: ${profile.name}`);
      } else {
        this.logger.log(`Profile ${data.name} already exists, skipping...`);
      }
    }
  }

  async reset(): Promise<void> {
    const result = await this.profileRepo.createQueryBuilder().delete().execute();
    this.logger.log(`Deleted ${result.affected} profiles`);
  }
}
