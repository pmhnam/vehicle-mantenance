import { MaintenanceType } from '../../maintenance/domain/maintenance-type.enum';

export interface IMaintenanceConfig {
  profileId: string;
  itemName: string;
  maintenanceType: MaintenanceType;
  intervalKm?: number | null;
  intervalMonths?: number | null;
}

export interface IMaintenanceLog {
  vehicleId: string;
  configId?: string | null;
  itemName: string;
  performedAtKm: number;
  performedAtDate: Date | string;
  cost?: number | null;
  note?: string | null;
}
