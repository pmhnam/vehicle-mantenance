import { MaintenanceCalculator } from './maintenance-calculator';
import { MaintenanceStatus } from './maintenance-status.enum';
import { CalculatorInput } from './maintenance.models';

describe('MaintenanceCalculator', () => {
  let calculator: MaintenanceCalculator;

  beforeEach(() => {
    calculator = new MaintenanceCalculator();
  });

  describe('Basic Calculations', () => {
    it('should return OK status when maintenance is not due', () => {
      const input: CalculatorInput = {
        currentOdo: 1000,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-03-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 6,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].overallStatus).toBe(MaintenanceStatus.OK);
      expect(result.items[0].nextDueKm).toBe(2000);
      expect(result.items[0].remainingKm).toBe(1000);
      expect(result.overallStatus).toBe(MaintenanceStatus.OK);
    });

    it('should return OVERDUE status when km exceeded', () => {
      const input: CalculatorInput = {
        currentOdo: 2500,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-03-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 12,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].overallStatus).toBe(MaintenanceStatus.OVERDUE);
      expect(result.items[0].remainingKm).toBe(-500);
      expect(result.items[0].urgencyReason).toBe('km');
      expect(result.overallStatus).toBe(MaintenanceStatus.OVERDUE);
    });

    it('should return OVERDUE status when date exceeded', () => {
      const input: CalculatorInput = {
        currentOdo: 100,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-08-01'), // 7 months later
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 10000,
            intervalMonths: 6,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].overallStatus).toBe(MaintenanceStatus.OVERDUE);
      expect(result.items[0].urgencyReason).toBe('date');
      expect(result.items[0].remainingDays).toBeLessThan(0);
    });

    it('should return DUE_SOON when within 10% threshold', () => {
      const input: CalculatorInput = {
        currentOdo: 1850, // 150km remaining, 10% of 2000 = 200
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-03-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 12,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].overallStatus).toBe(MaintenanceStatus.DUE_SOON);
      expect(result.items[0].remainingKm).toBe(150);
    });
  });

  describe('With Maintenance Logs', () => {
    it('should calculate from last log, not initial values', () => {
      const input: CalculatorInput = {
        currentOdo: 4500,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-06-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 6,
          },
        ],
        logs: [
          {
            id: 'log-1',
            configId: 'config-1',
            itemName: 'Oil Change',
            performedAtKm: 4000,
            performedAtDate: new Date('2024-05-01'),
          },
        ],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].lastPerformedKm).toBe(4000);
      expect(result.items[0].nextDueKm).toBe(6000);
      expect(result.items[0].remainingKm).toBe(1500);
      expect(result.items[0].overallStatus).toBe(MaintenanceStatus.OK);
    });

    it('should find the most recent log for config', () => {
      const input: CalculatorInput = {
        currentOdo: 6000,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-06-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 6,
          },
        ],
        logs: [
          {
            id: 'log-1',
            configId: 'config-1',
            itemName: 'Oil Change',
            performedAtKm: 2000,
            performedAtDate: new Date('2024-02-01'),
          },
          {
            id: 'log-2',
            configId: 'config-1',
            itemName: 'Oil Change',
            performedAtKm: 4000,
            performedAtDate: new Date('2024-04-01'),
          },
        ],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].lastPerformedKm).toBe(4000);
      expect(result.items[0].nextDueKm).toBe(6000);
    });

    it('should match logs by item name when configId is null', () => {
      const input: CalculatorInput = {
        currentOdo: 3000,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-03-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 6,
          },
        ],
        logs: [
          {
            id: 'log-1',
            configId: null,
            itemName: 'oil change', // case-insensitive match
            performedAtKm: 2000,
            performedAtDate: new Date('2024-02-15'),
          },
        ],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].lastPerformedKm).toBe(2000);
      expect(result.items[0].nextDueKm).toBe(4000);
    });
  });

  describe('Multiple Configs', () => {
    it('should handle multiple maintenance items', () => {
      const input: CalculatorInput = {
        currentOdo: 5000,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-06-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 6,
          },
          {
            id: 'config-2',
            itemName: 'Air Filter',
            intervalKm: 10000,
            intervalMonths: 12,
          },
        ],
        logs: [
          {
            id: 'log-1',
            configId: 'config-1',
            itemName: 'Oil Change',
            performedAtKm: 4000,
            performedAtDate: new Date('2024-05-01'),
          },
        ],
      };

      const result = calculator.calculate(input);

      expect(result.items).toHaveLength(2);

      const oilChange = result.items.find((i) => i.itemName === 'Oil Change');
      const airFilter = result.items.find((i) => i.itemName === 'Air Filter');

      expect(oilChange?.overallStatus).toBe(MaintenanceStatus.OK);
      expect(airFilter?.overallStatus).toBe(MaintenanceStatus.OK);
    });

    it('should return worst status as overall status', () => {
      const input: CalculatorInput = {
        currentOdo: 12000,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-06-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 12,
          },
          {
            id: 'config-2',
            itemName: 'Air Filter',
            intervalKm: 10000,
            intervalMonths: 12,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      const oilChange = result.items.find((i) => i.itemName === 'Oil Change');
      const airFilter = result.items.find((i) => i.itemName === 'Air Filter');

      expect(oilChange?.overallStatus).toBe(MaintenanceStatus.OVERDUE);
      expect(airFilter?.overallStatus).toBe(MaintenanceStatus.OVERDUE);
      expect(result.overallStatus).toBe(MaintenanceStatus.OVERDUE);
    });
  });

  describe('Edge Cases', () => {
    it('should handle km-only config (no interval_months)', () => {
      const input: CalculatorInput = {
        currentOdo: 1500,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-12-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: null,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].overallStatus).toBe(MaintenanceStatus.OK);
      expect(result.items[0].nextDueDate).toBeNull();
      expect(result.items[0].remainingDays).toBeNull();
    });

    it('should handle date-only config (no interval_km)', () => {
      const input: CalculatorInput = {
        currentOdo: 100000,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-03-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Annual Inspection',
            intervalKm: null,
            intervalMonths: 12,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      expect(result.items[0].overallStatus).toBe(MaintenanceStatus.OK);
      expect(result.items[0].nextDueKm).toBeNull();
      expect(result.items[0].remainingKm).toBeNull();
    });

    it('should handle empty configs', () => {
      const input: CalculatorInput = {
        currentOdo: 5000,
        initialOdo: 0,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-06-01'),
        configs: [],
        logs: [],
      };

      const result = calculator.calculate(input);

      expect(result.items).toHaveLength(0);
      expect(result.overallStatus).toBe(MaintenanceStatus.OK);
    });

    it('should use initial values when no logs exist', () => {
      const input: CalculatorInput = {
        currentOdo: 500,
        initialOdo: 100,
        purchaseDate: new Date('2024-01-01'),
        currentDate: new Date('2024-02-01'),
        configs: [
          {
            id: 'config-1',
            itemName: 'Oil Change',
            intervalKm: 2000,
            intervalMonths: 6,
          },
        ],
        logs: [],
      };

      const result = calculator.calculate(input);

      // Next due should be initialOdo + interval
      expect(result.items[0].nextDueKm).toBe(2100);
      expect(result.items[0].remainingKm).toBe(1600);
    });
  });
});
