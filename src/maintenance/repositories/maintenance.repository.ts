import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceConfig } from '../entities/maintenance-config.entity';
import { MaintenanceLog } from '../entities/maintenance-log.entity';
import { IMaintenanceRepository } from '../interfaces/maintenance.repository.interface';

import { MaintenanceProfile } from '../entities/maintenance-profile.entity';

@Injectable()
export class MaintenanceRepository implements IMaintenanceRepository {
  constructor(
    @InjectRepository(MaintenanceConfig)
    private readonly configRepo: Repository<MaintenanceConfig>,
    @InjectRepository(MaintenanceLog)
    private readonly logRepo: Repository<MaintenanceLog>,
    @InjectRepository(MaintenanceProfile)
    private readonly profileRepo: Repository<MaintenanceProfile>,
  ) {}

  // Profile operations
  async findProfileById(id: string): Promise<MaintenanceProfile | null> {
    return this.profileRepo.findOne({ where: { id } });
  }

  async findProfileByCode(code: string): Promise<MaintenanceProfile | null> {
    return this.profileRepo.findOne({ where: { code } });
  }

  async findAllProfiles(): Promise<MaintenanceProfile[]> {
    return this.profileRepo.find({ order: { name: 'ASC' } });
  }

  async createProfile(profile: Partial<MaintenanceProfile>): Promise<MaintenanceProfile> {
    const entity = this.profileRepo.create(profile);
    return this.profileRepo.save(entity);
  }

  async updateProfile(id: string, profile: Partial<MaintenanceProfile>): Promise<MaintenanceProfile | null> {
    const existing = await this.profileRepo.findOne({ where: { id } });
    if (!existing) return null;
    Object.assign(existing, profile);
    return this.profileRepo.save(existing);
  }

  async deleteProfile(id: string): Promise<boolean> {
    const result = await this.profileRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Config operations
  async findConfigById(id: string): Promise<MaintenanceConfig | null> {
    return this.configRepo.findOne({ where: { id } });
  }

  async findConfigsByVehicleId(vehicleId: string): Promise<MaintenanceConfig[]> {
    // We need to find the vehicle first to get its profileId
    // Since we can't inject VehicleRepository (dependency cycle), we'll do raw query or join
    // But better: MaintenanceConfig doesn't have vehicleId anymore.
    // So we query configs where profileId IN (SELECT profileId FROM vehicle WHERE id = :id)

    return this.configRepo
      .createQueryBuilder('config')
      .innerJoin('vehicles', 'vehicle', 'vehicle.profileId = config.profileId')
      .where('vehicle.id = :vehicleId', { vehicleId })
      .orderBy('config.itemName', 'ASC')
      .getMany();
  }

  async findConfigsByProfileId(profileId: string): Promise<MaintenanceConfig[]> {
    return this.configRepo.find({
      where: { profileId },
      order: { itemName: 'ASC' },
    });
  }

  async createConfig(config: Partial<MaintenanceConfig>): Promise<MaintenanceConfig> {
    const entity = this.configRepo.create(config);
    return this.configRepo.save(entity);
  }

  async updateConfig(id: string, config: Partial<MaintenanceConfig>): Promise<MaintenanceConfig | null> {
    const existing = await this.configRepo.findOne({ where: { id } });
    if (!existing) return null;
    Object.assign(existing, config);
    return this.configRepo.save(existing);
  }

  async deleteConfig(id: string): Promise<boolean> {
    const result = await this.configRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // Log operations
  async findLogById(id: string): Promise<MaintenanceLog | null> {
    return this.logRepo.findOne({ where: { id } });
  }

  async findLogsByVehicleId(vehicleId: string): Promise<MaintenanceLog[]> {
    return this.logRepo.find({
      where: { vehicleId },
      order: { performedAtDate: 'DESC', performedAtKm: 'DESC' },
    });
  }

  async createLog(log: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    const entity = this.logRepo.create(log);
    return this.logRepo.save(entity);
  }

  async deleteLog(id: string): Promise<boolean> {
    const result = await this.logRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
