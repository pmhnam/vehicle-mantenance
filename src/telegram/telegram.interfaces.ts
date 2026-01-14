import { Context } from 'telegraf';

export interface TelegramContext extends Context {
  session?: {
    awaitingLicensePlate?: boolean;
  };
  match?: RegExpExecArray; // For Action regex match
}

export enum AddConfigStep {
  ITEM_NAME = 'ITEM_NAME',
  MAINTENANCE_TYPE = 'MAINTENANCE_TYPE',
  INTERVAL_KM = 'INTERVAL_KM',
  INTERVAL_MONTHS = 'INTERVAL_MONTHS',
}

export interface ConfigCreationState {
  step: AddConfigStep;
  itemName?: string;
  maintenanceType?: string; // from Enum
  intervalKm?: number;
  intervalMonths?: number;
}

export interface Button {
  text: string;
  callback_data: string;
}

export interface ReplyMarkup {
  inline_keyboard: Button[][];
}

export interface ServiceResponse {
  text: string;
  reply_markup?: ReplyMarkup;
}
