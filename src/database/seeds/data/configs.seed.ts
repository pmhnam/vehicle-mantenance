import { MaintenanceType } from '../../../maintenance/domain/maintenance-type.enum.js';

interface ConfigSeedItem {
  itemName: string;
  type: MaintenanceType;
  intervalKm: number | null;
  intervalMonths: number | null;
}

/**
 * Honda Airblade Maintenance Schedule for Vietnam/HCM (Severe Conditions)
 */
export const HONDA_AIRBLADE_HCM_CONFIGS: ConfigSeedItem[] = [
  // === ENGINE & FUEL SYSTEM ===
  { itemName: 'Nhớt máy', type: MaintenanceType.REPLACE, intervalKm: 2000, intervalMonths: null },
  { itemName: 'Dầu động cơ', type: MaintenanceType.REPLACE, intervalKm: 8000, intervalMonths: null },
  { itemName: 'Lọc gió', type: MaintenanceType.REPLACE, intervalKm: 10000, intervalMonths: null },
  { itemName: 'Bugi', type: MaintenanceType.REPLACE, intervalKm: 12000, intervalMonths: null },
  { itemName: 'Vệ sinh nồi (CVT)', type: MaintenanceType.CLEAN, intervalKm: 5000, intervalMonths: null },
  { itemName: 'Vệ sinh kim phun & buồng đốt', type: MaintenanceType.CLEAN, intervalKm: 8000, intervalMonths: null },
  { itemName: 'Thông hơi vách máy', type: MaintenanceType.CLEAN, intervalKm: 6000, intervalMonths: null },
  { itemName: 'Lưới lọc dầu động cơ', type: MaintenanceType.CLEAN, intervalKm: 12000, intervalMonths: null },
  { itemName: 'Khe hở xu páp', type: MaintenanceType.CHECK, intervalKm: 10000, intervalMonths: null },
  { itemName: 'Tốc độ cầm chừng động cơ', type: MaintenanceType.CHECK, intervalKm: 8000, intervalMonths: null },

  // === COOLING SYSTEM ===
  { itemName: 'Nước làm mát', type: MaintenanceType.CHECK, intervalKm: 5000, intervalMonths: null },
  { itemName: 'Thay nước làm mát', type: MaintenanceType.REPLACE, intervalKm: 20000, intervalMonths: 24 },

  // === TRANSMISSION ===
  { itemName: 'Dây curoa', type: MaintenanceType.CHECK, intervalKm: 8000, intervalMonths: null },
  { itemName: 'Dây curoa', type: MaintenanceType.REPLACE, intervalKm: 24000, intervalMonths: null },
  { itemName: 'Nhớt láp (Dầu truyền động)', type: MaintenanceType.REPLACE, intervalKm: 6000, intervalMonths: 6 },

  // === BRAKES ===
  { itemName: 'Dầu phanh', type: MaintenanceType.REPLACE, intervalKm: 20000, intervalMonths: 24 },
  { itemName: 'Má phanh trước/sau', type: MaintenanceType.CHECK, intervalKm: 4000, intervalMonths: null },

  // === ELECTRICAL ===
  { itemName: 'Bình điện', type: MaintenanceType.CHECK, intervalKm: 6000, intervalMonths: null },
  { itemName: 'Đèn/còi', type: MaintenanceType.CHECK, intervalKm: 1000, intervalMonths: null },

  // === CHASSIS & BODY ===
  { itemName: 'Chân chống nghiêng', type: MaintenanceType.CHECK, intervalKm: 4000, intervalMonths: null },
  { itemName: 'Phuộc nhún (Giảm xóc)', type: MaintenanceType.CHECK, intervalKm: 10000, intervalMonths: null },
  { itemName: 'Áp suất lốp & độ mòn', type: MaintenanceType.CHECK, intervalKm: 2000, intervalMonths: null },
  { itemName: 'Chén cổ (Vòng bi cổ lái)', type: MaintenanceType.CHECK, intervalKm: 12000, intervalMonths: null },
];

/**
 * Config seeds mapped to profile codes
 */
export const CONFIG_SEEDS: Record<string, ConfigSeedItem[]> = {
  HONDA_AIRBLADE_HCM_SEVERE: HONDA_AIRBLADE_HCM_CONFIGS,
  HONDA_VARIO_HCM_SEVERE: [...HONDA_AIRBLADE_HCM_CONFIGS], // Vario similar to Airblade
  GENERIC_SCOOTER_HCM: [...HONDA_AIRBLADE_HCM_CONFIGS], // Generic scooter
};
