import { MaintenanceType } from './maintenance-type.enum';

/**
 * Honda Airblade Maintenance Schedule for Vietnam/HCM (Severe Conditions)
 * Môi trường: Bụi bẩn, kẹt xe, chạy cự ly ngắn, ngập nước.
 * K = Kiểm tra (Check), T = Thay thế (Replace), V = Vệ sinh (Clean)
 */
export const HONDA_AIRBLADE_HCM_CONFIGS = [
  // === ENGINE & FUEL SYSTEM ===
  // Nhớt máy: Thay sớm hơn (1500-2000km) do kẹt xe, máy nóng
  { itemName: 'Nhớt máy', type: MaintenanceType.REPLACE, intervalKm: 2000, intervalMonths: null },
  { itemName: 'Dầu động cơ', type: MaintenanceType.REPLACE, intervalKm: 8000, intervalMonths: null }, // Lọc thô

  // Lọc gió: Môi trường bụi, thay sớm hơn (10000km)
  { itemName: 'Lọc gió', type: MaintenanceType.REPLACE, intervalKm: 10000, intervalMonths: null },

  // Bugi: Thay sớm hơn để đảm bảo đánh lửa tốt (10000-12000km)
  { itemName: 'Bugi', type: MaintenanceType.REPLACE, intervalKm: 12000, intervalMonths: null },

  // Vệ sinh nồi, kim phun, buồng đốt (định kỳ mỗi 5000-8000km)
  { itemName: 'Vệ sinh nồi (CVT)', type: MaintenanceType.CLEAN, intervalKm: 5000, intervalMonths: null },
  { itemName: 'Vệ sinh kim phun & buồng đốt', type: MaintenanceType.CLEAN, intervalKm: 8000, intervalMonths: null },

  { itemName: 'Thông hơi vách máy', type: MaintenanceType.CLEAN, intervalKm: 6000, intervalMonths: null },
  { itemName: 'Lưới lọc dầu động cơ', type: MaintenanceType.CLEAN, intervalKm: 12000, intervalMonths: null },
  { itemName: 'Khe hở xu páp', type: MaintenanceType.CHECK, intervalKm: 10000, intervalMonths: null },
  { itemName: 'Tốc độ cầm chừng động cơ', type: MaintenanceType.CHECK, intervalKm: 8000, intervalMonths: null },

  // === COOLING SYSTEM (Quan trọng vì kẹt xe gây nóng máy) ===
  { itemName: 'Nước làm mát', type: MaintenanceType.CHECK, intervalKm: 5000, intervalMonths: null },
  { itemName: 'Thay nước làm mát', type: MaintenanceType.REPLACE, intervalKm: 20000, intervalMonths: 24 }, // Sớm hơn tiêu chuẩn 36000km

  // === TRANSMISSION ===
  { itemName: 'Dây curoa', type: MaintenanceType.CHECK, intervalKm: 8000, intervalMonths: null },
  { itemName: 'Dây curoa', type: MaintenanceType.REPLACE, intervalKm: 24000, intervalMonths: null }, // Honda khuyến cáo 24k km
  // Nhớt láp (Dầu truyền động): 3 lần nhớt máy = 1 lần nhớt láp (6000km)
  { itemName: 'Nhớt láp (Dầu truyền động)', type: MaintenanceType.REPLACE, intervalKm: 6000, intervalMonths: 6 },

  // === BRAKES ===
  { itemName: 'Dầu phanh', type: MaintenanceType.REPLACE, intervalKm: 20000, intervalMonths: 24 },
  { itemName: 'Má phanh trước/sau', type: MaintenanceType.CHECK, intervalKm: 4000, intervalMonths: null }, // Kiểm tra thường xuyên hơn

  // === ELECTRICAL ===
  { itemName: 'Bình điện', type: MaintenanceType.CHECK, intervalKm: 6000, intervalMonths: null },
  { itemName: 'Đèn/còi', type: MaintenanceType.CHECK, intervalKm: 1000, intervalMonths: null },

  // === CHASSIS & BODY ===
  { itemName: 'Chân chống nghiêng', type: MaintenanceType.CHECK, intervalKm: 4000, intervalMonths: null },
  { itemName: 'Phuộc nhún (Giảm xóc)', type: MaintenanceType.CHECK, intervalKm: 10000, intervalMonths: null },
  { itemName: 'Áp suất lốp & độ mòn', type: MaintenanceType.CHECK, intervalKm: 2000, intervalMonths: null }, // Kiểm tra thường xuyên
  { itemName: 'Chén cổ (Vòng bi cổ lái)', type: MaintenanceType.CHECK, intervalKm: 12000, intervalMonths: null },
];

export const HONDA_VARIO_HCM_CONFIGS = [
  ...HONDA_AIRBLADE_HCM_CONFIGS, // Vario tương tự Airblade về động cơ 125/150/160 ESP+
];

export const OTHER_SCOOTER_CONFIGS = [
  // Create a generic scooter profile (Vision/Lead) - Remove water coolant checks if generic?
  // For simplicity, just clone for now.
  ...HONDA_AIRBLADE_HCM_CONFIGS,
];
