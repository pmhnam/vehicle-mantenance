import { MaintenanceConfig } from '../entities/maintenance-config.entity';
import { MaintenanceLog } from '../entities/maintenance-log.entity';
import { MaintenanceProfile } from '../entities/maintenance-profile.entity';

export const MAINTENANCE_REPOSITORY = 'MAINTENANCE_REPOSITORY';

export interface IMaintenanceRepository {
  // Profile operations
  findProfileById(id: string): Promise<MaintenanceProfile | null>;
  findProfileByCode(code: string): Promise<MaintenanceProfile | null>;
  findAllProfiles(): Promise<MaintenanceProfile[]>;
  createProfile(profile: Partial<MaintenanceProfile>): Promise<MaintenanceProfile>;
  updateProfile(id: string, profile: Partial<MaintenanceProfile>): Promise<MaintenanceProfile | null>;
  deleteProfile(id: string): Promise<boolean>;

  // Config operations
  findConfigById(id: string): Promise<MaintenanceConfig | null>;
  findConfigsByVehicleId(vehicleId: string): Promise<MaintenanceConfig[]>;
  findConfigsByProfileId(profileId: string): Promise<MaintenanceConfig[]>;
  createConfig(config: Partial<MaintenanceConfig>): Promise<MaintenanceConfig>;
  updateConfig(id: string, config: Partial<MaintenanceConfig>): Promise<MaintenanceConfig | null>;
  deleteConfig(id: string): Promise<boolean>;

  // Log operations
  findLogById(id: string): Promise<MaintenanceLog | null>;
  findLogsByVehicleId(vehicleId: string): Promise<MaintenanceLog[]>;
  createLog(log: Partial<MaintenanceLog>): Promise<MaintenanceLog>;
  deleteLog(id: string): Promise<boolean>;
}
