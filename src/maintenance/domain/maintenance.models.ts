import { MaintenanceStatus } from './maintenance-status.enum';
import { MaintenanceType } from './maintenance-type.enum';

/**
 * Input model for a maintenance configuration rule
 */
export interface MaintenanceConfigInput {
  id: string;
  itemName: string;
  maintenanceType: MaintenanceType;
  intervalKm: number | null;
  intervalMonths: number | null;
}

/**
 * Input model for a maintenance log entry
 */
export interface MaintenanceLogInput {
  id: string;
  configId: string | null;
  itemName: string;
  performedAtKm: number;
  performedAtDate: Date;
}

/**
 * Input for the maintenance calculator
 */
export interface CalculatorInput {
  currentOdo: number;
  initialOdo: number;
  purchaseDate: Date;
  configs: MaintenanceConfigInput[];
  logs: MaintenanceLogInput[];
  currentDate: Date;
}

/**
 * Output for a single maintenance item status
 */
export interface MaintenanceItemStatus {
  configId: string;
  itemName: string;
  maintenanceType: MaintenanceType;
  status: MaintenanceStatus;

  // KM-based calculations
  lastPerformedKm: number | null;
  nextDueKm: number | null;
  remainingKm: number | null;

  // Date-based calculations
  lastPerformedDate: Date | null;
  nextDueDate: Date | null;
  remainingDays: number | null;

  // Overall assessment
  overallStatus: MaintenanceStatus;
  urgencyReason: 'km' | 'date' | null;
}

/**
 * Full maintenance status report output
 */
export interface MaintenanceStatusReport {
  vehicleId?: string;
  currentOdo: number;
  reportDate: Date;
  items: MaintenanceItemStatus[];
  overallStatus: MaintenanceStatus;
}
