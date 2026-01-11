import { Context } from 'telegraf';

export interface TelegramContext extends Context {
  session?: {
    awaitingLicensePlate?: boolean;
  };
  match?: RegExpExecArray; // For Action regex match
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
