import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramUser } from './entities/telegram-user.entity';
import { VehicleService } from '../vehicle/vehicle.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { MaintenanceStatus } from '../maintenance/domain/maintenance-status.enum';
import { MaintenanceType } from '../maintenance/domain/maintenance-type.enum';
import type { MaintenanceStatusReport, MaintenanceItemStatus } from '../maintenance/domain/maintenance.models';
import { TELEGRAM_MESSAGES } from './telegram.constants';
import { ServiceResponse } from './telegram.interfaces';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramUser)
    private readonly telegramUserRepo: Repository<TelegramUser>,
    private readonly vehicleService: VehicleService,
    private readonly maintenanceService: MaintenanceService,
  ) {}

  async findOrCreateUser(
    telegramId: number,
    chatId: number,
    username?: string,
    firstName?: string,
  ): Promise<TelegramUser> {
    let user = await this.telegramUserRepo.findOne({ where: { telegramId } });

    if (!user) {
      user = this.telegramUserRepo.create({
        telegramId,
        chatId,
        username: username || null,
        firstName: firstName || null,
      });
      await this.telegramUserRepo.save(user);
    }

    return user;
  }

  async linkVehicle(telegramId: number, licensePlate: string): Promise<string> {
    const user = await this.telegramUserRepo.findOne({ where: { telegramId } });
    if (!user) {
      return TELEGRAM_MESSAGES.ERROR_START_REQUIRED;
    }

    // Find vehicle by license plate
    const vehicles = await this.vehicleService.findAll();
    const vehicle = vehicles.find(
      (v) => v.licensePlate.replace(/[\s-]/g, '').toLowerCase() === licensePlate.replace(/[\s-]/g, '').toLowerCase(),
    );

    if (!vehicle) {
      return TELEGRAM_MESSAGES.ERROR_VEHICLE_NOT_FOUND(licensePlate);
    }

    user.vehicleId = vehicle.id;
    await this.telegramUserRepo.save(user);

    return TELEGRAM_MESSAGES.SUCCESS_LINK(vehicle.name, vehicle.licensePlate, vehicle.currentOdo.toLocaleString());
  }

  async createVehicle(telegramId: number, name: string, licensePlate: string): Promise<ServiceResponse> {
    const user = await this.findOrCreateUser(telegramId, telegramId);

    try {
      const vehicle = await this.vehicleService.create({
        name,
        licensePlate,
        initialOdo: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
      });

      // Assign default profile (HCM - Severe)
      await this.maintenanceService.assignDefaultProfile(vehicle.id);

      // Auto-link to user
      user.vehicleId = vehicle.id;
      await this.telegramUserRepo.save(user);

      // Get profiles for selection
      const profiles = await this.maintenanceService.getAllProfiles();

      // Create inline buttons
      const buttons = profiles.map((p) => [{ text: p.name, callback_data: `SET_PROFILE:${p.code}` }]);

      return {
        text: TELEGRAM_MESSAGES.SUCCESS_CREATE(vehicle.name, vehicle.licensePlate),
        reply_markup: { inline_keyboard: buttons },
      };
    } catch {
      return { text: TELEGRAM_MESSAGES.ERROR_CREATE_VEHICLE };
    }
  }

  async changeUserProfile(telegramId: number, profileCode: string): Promise<string> {
    const user = await this.telegramUserRepo.findOne({ where: { telegramId } });
    if (!user || !user.vehicleId) {
      return TELEGRAM_MESSAGES.LINK_PROFILE_ERROR_NO_VEHICLE;
    }

    const profile = await this.maintenanceService.getProfileByCode(profileCode); // Need to add this to MaintenanceService?
    // Or use maintenanceRepository directly if exposed
    // Actually maintenanceService doesn't have getProfileByCode public yet, but I can add it or use getAll and find.
    // Better add getProfileByCode to MaintenanceService.

    if (!profile) return TELEGRAM_MESSAGES.PROFILE_NOT_FOUND;

    await this.vehicleService.bindProfile(user.vehicleId, profile.id);

    return TELEGRAM_MESSAGES.PROFILE_UPDATED(profile.name);
  }

  async updateOdo(telegramId: number, km: number): Promise<string> {
    const user = await this.telegramUserRepo.findOne({ where: { telegramId } });
    if (!user) {
      return TELEGRAM_MESSAGES.ERROR_START_REQUIRED;
    }

    if (!user.vehicleId) {
      return TELEGRAM_MESSAGES.ERROR_NO_VEHICLE;
    }

    try {
      await this.vehicleService.updateOdo(user.vehicleId, km);
      const status = await this.maintenanceService.getMaintenanceStatus(user.vehicleId);

      return TELEGRAM_MESSAGES.SUCCESS_ODO(km.toLocaleString(), this.formatStatusReport(status));
    } catch {
      return TELEGRAM_MESSAGES.ERROR_UPDATE_ODO;
    }
  }

  async getStatus(telegramId: number): Promise<string> {
    const user = await this.telegramUserRepo.findOne({ where: { telegramId } });
    if (!user) {
      return TELEGRAM_MESSAGES.ERROR_START_REQUIRED;
    }

    if (!user.vehicleId) {
      return TELEGRAM_MESSAGES.ERROR_NO_VEHICLE;
    }

    try {
      const vehicle = await this.vehicleService.findById(user.vehicleId);
      const status = await this.maintenanceService.getMaintenanceStatus(user.vehicleId);

      let message = TELEGRAM_MESSAGES.STATUS_HEADER(
        vehicle.name,
        vehicle.licensePlate,
        vehicle.currentOdo.toLocaleString(),
      );
      message += this.formatStatusReport(status);

      return message;
    } catch {
      return TELEGRAM_MESSAGES.ERROR_GET_STATUS;
    }
  }

  private formatStatusReport(report: MaintenanceStatusReport): string {
    if (report.items.length === 0) {
      return TELEGRAM_MESSAGES.STATUS_EMPTY;
    }

    const overdue = report.items.filter((i) => i.overallStatus === MaintenanceStatus.OVERDUE);
    const dueSoon = report.items.filter((i) => i.overallStatus === MaintenanceStatus.DUE_SOON);

    // All OK - nothing to show
    if (overdue.length === 0 && dueSoon.length === 0) {
      return TELEGRAM_MESSAGES.STATUS_ALL_OK;
    }

    let message = '';

    if (overdue.length > 0) {
      message += '🔴 <b>QUÁ HẠN</b>\n';
      overdue.forEach((item) => {
        message += this.formatItemLine(item);
      });
      message += '\n';
    }

    if (dueSoon.length > 0) {
      message += '🟡 <b>SẮP ĐẾN HẠN</b>\n';
      dueSoon.forEach((item) => {
        message += this.formatItemLine(item);
      });
      message += '\n';
    }

    message += '<i>🔄=Thay  🔍=Kiểm tra  🧹=Vệ sinh</i>';

    return message;
  }

  private getTypeIcon(type: MaintenanceType): string {
    switch (type) {
      case MaintenanceType.REPLACE:
        return '🔄';
      case MaintenanceType.CHECK:
        return '🔍';
      case MaintenanceType.CLEAN:
        return '🧹';
      default:
        return '•';
    }
  }

  private formatItemLine(item: MaintenanceItemStatus): string {
    const typeIcon = this.getTypeIcon(item.maintenanceType);
    const kmInfo =
      item.remainingKm !== null
        ? item.remainingKm < 0
          ? ` <i>(quá <code>${Math.abs(item.remainingKm).toLocaleString()}</code> km)</i>`
          : ` <i>(còn <code>${item.remainingKm.toLocaleString()}</code> km)</i>`
        : '';
    return `   ${typeIcon} ${item.itemName}${kmInfo}\n`;
  }
}
