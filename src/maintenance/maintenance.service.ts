import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IMaintenanceRepository } from './interfaces/maintenance.repository.interface';
import { MAINTENANCE_REPOSITORY } from './interfaces/maintenance.repository.interface';
import { VehicleService } from '../vehicle/vehicle.service';
import { MaintenanceCalculator } from './domain/maintenance-calculator';
import { MaintenanceStatusReport } from './domain/maintenance.models';
import { CreateConfigDto } from './dto/create-config.dto';
import { LogMaintenanceDto } from './dto/log-maintenance.dto';
import { MaintenanceConfig } from './entities/maintenance-config.entity';
import { HONDA_AIRBLADE_HCM_CONFIGS } from './domain/maintenance.constants';
import { MaintenanceLog } from './entities/maintenance-log.entity';
import { MaintenanceProfile } from './entities/maintenance-profile.entity';
import { MaintenanceType } from './domain/maintenance-type.enum';

@Injectable()
export class MaintenanceService {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly vehicleService: VehicleService,
    private readonly maintenanceCalculator: MaintenanceCalculator,
  ) {}

  /**
   * Get maintenance status report for a vehicle
   */
  async getMaintenanceStatus(vehicleId: string): Promise<MaintenanceStatusReport> {
    // Fetch vehicle data
    const vehicle = await this.vehicleService.findById(vehicleId);

    // Fetch configs and logs
    const configs = await this.maintenanceRepository.findConfigsByVehicleId(vehicleId);
    const logs = await this.maintenanceRepository.findLogsByVehicleId(vehicleId);

    // Transform to calculator input and calculate
    const report = this.maintenanceCalculator.calculate({
      currentOdo: vehicle.currentOdo,
      initialOdo: vehicle.initialOdo,
      purchaseDate: vehicle.purchaseDate,
      currentDate: new Date(),
      configs: configs.map((c) => ({
        id: c.id,
        itemName: c.itemName,
        maintenanceType: c.maintenanceType,
        intervalKm: c.intervalKm,
        intervalMonths: c.intervalMonths,
      })),
      logs: logs.map((l) => ({
        id: l.id,
        configId: l.configId,
        itemName: l.itemName,
        performedAtKm: l.performedAtKm,
        performedAtDate: l.performedAtDate,
      })),
    });

    return {
      ...report,
      vehicleId,
    };
  }

  /**
   * Create a new maintenance configuration
   */
  async createConfig(dto: CreateConfigDto): Promise<MaintenanceConfig> {
    // Validate profile exists
    const profile = await this.maintenanceRepository.findProfileById(dto.profileId);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${dto.profileId} not found`);
    }

    return this.maintenanceRepository.createConfig({
      profileId: dto.profileId,
      itemName: dto.itemName,
      maintenanceType: dto.maintenanceType,
      intervalKm: dto.intervalKm ?? null,
      intervalMonths: dto.intervalMonths ?? null,
    });
  }

  /**
   * Get all configs for a vehicle
   */
  async getConfigsByVehicleId(vehicleId: string): Promise<MaintenanceConfig[]> {
    await this.vehicleService.findById(vehicleId);
    return this.maintenanceRepository.findConfigsByVehicleId(vehicleId);
  }

  /**
   * Get all configs for a profile
   */
  async getConfigsByProfileId(profileId: string): Promise<MaintenanceConfig[]> {
    const profile = await this.maintenanceRepository.findProfileById(profileId);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }
    return this.maintenanceRepository.findConfigsByProfileId(profileId);
  }

  /**
   * Update a maintenance configuration
   */
  async updateConfig(
    id: string,
    data: { itemName?: string; maintenanceType?: MaintenanceType; intervalKm?: number; intervalMonths?: number },
  ): Promise<MaintenanceConfig> {
    const updated = await this.maintenanceRepository.updateConfig(id, {
      ...(data.itemName && { itemName: data.itemName }),
      ...(data.maintenanceType && { maintenanceType: data.maintenanceType }),
      ...(data.intervalKm !== undefined && { intervalKm: data.intervalKm }),
      ...(data.intervalMonths !== undefined && { intervalMonths: data.intervalMonths }),
    });
    if (!updated) {
      throw new NotFoundException(`Maintenance config with ID ${id} not found`);
    }
    return updated;
  }

  /**
   * Delete a maintenance configuration
   */
  async deleteConfig(id: string): Promise<void> {
    const deleted = await this.maintenanceRepository.deleteConfig(id);
    if (!deleted) {
      throw new NotFoundException(`Maintenance config with ID ${id} not found`);
    }
  }

  /**
   * Log a maintenance activity
   */
  async logMaintenance(dto: LogMaintenanceDto): Promise<MaintenanceLog> {
    // Validate vehicle exists
    await this.vehicleService.findById(dto.vehicleId);

    // Validate config exists if provided
    if (dto.configId) {
      const config = await this.maintenanceRepository.findConfigById(dto.configId);
      if (!config) {
        throw new NotFoundException(`Maintenance config with ID ${dto.configId} not found`);
      }
    }

    return this.maintenanceRepository.createLog({
      vehicleId: dto.vehicleId,
      configId: dto.configId ?? null,
      itemName: dto.itemName,
      performedAtKm: dto.performedAtKm,
      performedAtDate: new Date(dto.performedAtDate),
      cost: dto.cost ?? null,
      note: dto.note ?? null,
    });
  }

  /**
   * Get all logs for a vehicle
   */
  async getLogsByVehicleId(vehicleId: string): Promise<MaintenanceLog[]> {
    await this.vehicleService.findById(vehicleId);
    return this.maintenanceRepository.findLogsByVehicleId(vehicleId);
  }

  /**
   * Delete a maintenance log
   */
  async deleteLog(id: string): Promise<void> {
    const deleted = await this.maintenanceRepository.deleteLog(id);
    if (!deleted) {
      throw new NotFoundException(`Maintenance log with ID ${id} not found`);
    }
  }

  /**
   * Assign default maintenance profile (HCM - Severe) to a vehicle
   */
  async assignDefaultProfile(vehicleId: string): Promise<void> {
    const vehicle = await this.vehicleService.findById(vehicleId);
    if (vehicle.profileId) return; // Already has profile

    // Check if default profile exists
    const profileCode = 'HONDA_AIRBLADE_HCM_SEVERE';
    let profile = await this.maintenanceRepository.findProfileByCode(profileCode);

    if (!profile) {
      // Create profile and configs dynamically if not exists (Lazy seeding)
      profile = await this.maintenanceRepository.createProfile({
        code: profileCode,
        name: 'Honda Airblade (HCM - Severe)',
        description: 'Lịch bảo dưỡng cho điều kiện khắc nghiệt tại TP.HCM (Auto-created)',
      });

      // Create profile and configs dynamically if not exists (Lazy seeding)
      profile = await this.maintenanceRepository.createProfile({
        code: profileCode,
        name: 'Honda Airblade (HCM - Severe)',
        description: 'Lịch bảo dưỡng cho điều kiện khắc nghiệt tại TP.HCM (Auto-created)',
      });

      // Use static import instead of dynamic
      for (const data of HONDA_AIRBLADE_HCM_CONFIGS) {
        await this.maintenanceRepository.createConfig({
          profileId: profile.id,
          itemName: data.itemName,
          maintenanceType: data.type,
          intervalKm: data.intervalKm,
          intervalMonths: data.intervalMonths,
        });
      }
    }

    // Assign to vehicle
    // We need to update vehicle directly. Since VehicleService might not have updateProfile method yet.
    // Ideally VehicleService should handle vehicle updates.
    // For now, let's assuming we can update vehicle via VehicleService or we'll add a method there.
    // Actually, VehicleService.update takes UpdateVehicleDto. Let's use it if it supports profileId?
    // Current UpdateVehicleDto doesn't have profileId. But we can update Vehicle entity directly if we inject Repo, but we don't have it here.
    // We can assume we can call an update method.
    // Hack: We will call vehicleService.update with implicit casting or add profileId to DTO properly.
    // Better: Add updateProfile method to VehicleService. We don't have access to modify VehicleService easily right now without bouncing back.
    // Let's modify VehicleService to allow updating profileId.

    // Wait, I can't modify VehicleService and MaintenanceService in parallel blocks efficiently.
    // I will call a raw update or use the TelegramService to do the linking because TelegramService has access to everything?
    // No, TelegramService puts logic here.

    // Let's assume we modified VehicleService to allow profileId update.
    // Or simpler: Just inject VehicleRepository into MaintenanceService?
    // No, circular dependency potential if VehicleService uses MaintenanceService.

    // Let's just create a new method in VehicleService: bindProfile(vehicleId, profileId)
    await this.vehicleService.bindProfile(vehicleId, profile.id);
  }

  async getAllProfiles(): Promise<MaintenanceProfile[]> {
    return this.maintenanceRepository.findAllProfiles();
  }

  async getProfileById(id: string): Promise<MaintenanceProfile> {
    const profile = await this.maintenanceRepository.findProfileById(id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async getProfileByCode(code: string): Promise<MaintenanceProfile | null> {
    return this.maintenanceRepository.findProfileByCode(code);
  }

  async createNewProfile(data: { name: string; code: string; description?: string }): Promise<MaintenanceProfile> {
    // Check if code already exists
    const existing = await this.maintenanceRepository.findProfileByCode(data.code);
    if (existing) {
      throw new Error(`Profile with code ${data.code} already exists`);
    }
    return this.maintenanceRepository.createProfile({
      name: data.name,
      code: data.code,
      description: data.description,
    });
  }

  async updateProfile(
    id: string,
    data: { name?: string; code?: string; description?: string },
  ): Promise<MaintenanceProfile> {
    // Check if code already exists for another profile
    if (data.code) {
      const existing = await this.maintenanceRepository.findProfileByCode(data.code);
      if (existing && existing.id !== id) {
        throw new Error(`Profile with code ${data.code} already exists`);
      }
    }
    const updated = await this.maintenanceRepository.updateProfile(id, {
      ...(data.name && { name: data.name }),
      ...(data.code && { code: data.code }),
      ...(data.description !== undefined && { description: data.description }),
    });
    if (!updated) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return updated;
  }

  async deleteProfile(id: string): Promise<void> {
    const deleted = await this.maintenanceRepository.deleteProfile(id);
    if (!deleted) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }
}
