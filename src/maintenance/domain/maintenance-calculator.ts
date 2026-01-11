import { Injectable } from '@nestjs/common';
import { addMonths, differenceInDays } from 'date-fns';
import { MaintenanceStatus } from './maintenance-status.enum';
import {
  CalculatorInput,
  MaintenanceConfigInput,
  MaintenanceLogInput,
  MaintenanceItemStatus,
  MaintenanceStatusReport,
} from './maintenance.models';

/**
 * Pure domain service for calculating maintenance status.
 * This service has NO database dependencies - it only works with plain objects.
 * This makes it highly testable and reusable.
 */
@Injectable()
export class MaintenanceCalculator {
  // Threshold for "DUE_SOON" status (10% of interval remaining)
  private readonly DUE_SOON_THRESHOLD = 0.1;

  /**
   * Calculate maintenance status for all configured items
   */
  calculate(input: CalculatorInput): MaintenanceStatusReport {
    const items: MaintenanceItemStatus[] = input.configs.map((config) => this.calculateItemStatus(config, input));

    const overallStatus = this.determineOverallStatus(items);

    return {
      currentOdo: input.currentOdo,
      reportDate: input.currentDate,
      items,
      overallStatus,
    };
  }

  /**
   * Calculate status for a single maintenance item
   */
  private calculateItemStatus(config: MaintenanceConfigInput, input: CalculatorInput): MaintenanceItemStatus {
    const lastLog = this.findLastLogForConfig(config, input.logs);

    // Determine baseline values (from last log or initial vehicle data)
    const lastPerformedKm = lastLog?.performedAtKm ?? input.initialOdo;
    const lastPerformedDate = lastLog?.performedAtDate ?? input.purchaseDate;

    // Calculate KM-based status
    const kmStatus = this.calculateKmStatus(config.intervalKm, lastPerformedKm, input.currentOdo);

    // Calculate date-based status
    const dateStatus = this.calculateDateStatus(config.intervalMonths, lastPerformedDate, input.currentDate);

    // Determine overall status (worst of the two)
    const { overallStatus, urgencyReason } = this.combineStatuses(kmStatus.status, dateStatus.status);

    return {
      configId: config.id,
      itemName: config.itemName,
      maintenanceType: config.maintenanceType,
      status: overallStatus,
      lastPerformedKm: lastLog ? lastPerformedKm : null,
      nextDueKm: kmStatus.nextDue,
      remainingKm: kmStatus.remaining,
      lastPerformedDate: lastLog ? lastPerformedDate : null,
      nextDueDate: dateStatus.nextDue,
      remainingDays: dateStatus.remaining,
      overallStatus,
      urgencyReason,
    };
  }

  /**
   * Find the most recent log for a given config item
   */
  private findLastLogForConfig(
    config: MaintenanceConfigInput,
    logs: MaintenanceLogInput[],
  ): MaintenanceLogInput | null {
    // Match by configId first, then by itemName as fallback
    const matchingLogs = logs.filter(
      (log) => log.configId === config.id || log.itemName.toLowerCase() === config.itemName.toLowerCase(),
    );

    if (matchingLogs.length === 0) return null;

    // Return the most recent log (by performed date and km)
    return matchingLogs.reduce((latest, current) => {
      if (current.performedAtKm > latest.performedAtKm) return current;
      if (current.performedAtKm === latest.performedAtKm && current.performedAtDate > latest.performedAtDate)
        return current;
      return latest;
    });
  }

  /**
   * Calculate KM-based maintenance status
   */
  private calculateKmStatus(
    intervalKm: number | null,
    lastPerformedKm: number,
    currentOdo: number,
  ): { status: MaintenanceStatus | null; nextDue: number | null; remaining: number | null } {
    if (intervalKm === null) {
      return { status: null, nextDue: null, remaining: null };
    }

    const nextDueKm = lastPerformedKm + intervalKm;
    const remainingKm = nextDueKm - currentOdo;
    const threshold = intervalKm * this.DUE_SOON_THRESHOLD;

    let status: MaintenanceStatus;
    if (remainingKm <= 0) {
      status = MaintenanceStatus.OVERDUE;
    } else if (remainingKm <= threshold) {
      status = MaintenanceStatus.DUE_SOON;
    } else {
      status = MaintenanceStatus.OK;
    }

    return { status, nextDue: nextDueKm, remaining: remainingKm };
  }

  /**
   * Calculate date-based maintenance status
   */
  private calculateDateStatus(
    intervalMonths: number | null,
    lastPerformedDate: Date,
    currentDate: Date,
  ): { status: MaintenanceStatus | null; nextDue: Date | null; remaining: number | null } {
    if (intervalMonths === null) {
      return { status: null, nextDue: null, remaining: null };
    }

    const nextDueDate = addMonths(lastPerformedDate, intervalMonths);
    const remainingDays = differenceInDays(nextDueDate, currentDate);
    const totalIntervalDays = differenceInDays(nextDueDate, lastPerformedDate);
    const threshold = totalIntervalDays * this.DUE_SOON_THRESHOLD;

    let status: MaintenanceStatus;
    if (remainingDays <= 0) {
      status = MaintenanceStatus.OVERDUE;
    } else if (remainingDays <= threshold) {
      status = MaintenanceStatus.DUE_SOON;
    } else {
      status = MaintenanceStatus.OK;
    }

    return { status, nextDue: nextDueDate, remaining: remainingDays };
  }

  /**
   * Combine KM and date statuses to determine overall status
   */
  private combineStatuses(
    kmStatus: MaintenanceStatus | null,
    dateStatus: MaintenanceStatus | null,
  ): { overallStatus: MaintenanceStatus; urgencyReason: 'km' | 'date' | null } {
    const statusPriority = {
      [MaintenanceStatus.OVERDUE]: 3,
      [MaintenanceStatus.DUE_SOON]: 2,
      [MaintenanceStatus.OK]: 1,
    };

    if (kmStatus === null && dateStatus === null) {
      return { overallStatus: MaintenanceStatus.OK, urgencyReason: null };
    }

    if (kmStatus === null) {
      return { overallStatus: dateStatus!, urgencyReason: 'date' };
    }

    if (dateStatus === null) {
      return { overallStatus: kmStatus, urgencyReason: 'km' };
    }

    const kmPriority = statusPriority[kmStatus];
    const datePriority = statusPriority[dateStatus];

    if (kmPriority >= datePriority) {
      return { overallStatus: kmStatus, urgencyReason: 'km' };
    } else {
      return { overallStatus: dateStatus, urgencyReason: 'date' };
    }
  }

  /**
   * Determine overall status from all items
   */
  private determineOverallStatus(items: MaintenanceItemStatus[]): MaintenanceStatus {
    if (items.length === 0) return MaintenanceStatus.OK;

    if (items.some((item) => item.overallStatus === MaintenanceStatus.OVERDUE)) {
      return MaintenanceStatus.OVERDUE;
    }

    if (items.some((item) => item.overallStatus === MaintenanceStatus.DUE_SOON)) {
      return MaintenanceStatus.DUE_SOON;
    }

    return MaintenanceStatus.OK;
  }
}
