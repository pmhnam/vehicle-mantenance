import { DynamicModule, Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUser } from './entities/telegram-user.entity';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { VehicleModule } from '../vehicle/vehicle.module';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({})
export class TelegramModule {
  private static readonly logger = new Logger(TelegramModule.name);

  static forRoot(): DynamicModule {
    const enabled = TelegramModule.isEnabled();
    const token = (process.env.TELEGRAM_BOT_TOKEN ?? '').trim();

    if (!enabled) {
      TelegramModule.logger.warn(
        'Telegram integration is DISABLED (set TELEGRAM_ENABLED=true to enable)',
      );
      return {
        module: TelegramModule,
        imports: [],
        providers: [],
        exports: [],
      };
    }

    if (!token) {
      TelegramModule.logger.error(
        'Telegram integration is ENABLED but TELEGRAM_BOT_TOKEN is empty. ' +
          'Skipping Telegram bot startup. ' +
          'Set TELEGRAM_BOT_TOKEN or set TELEGRAM_ENABLED=false.',
      );
      return {
        module: TelegramModule,
        imports: [],
        providers: [],
        exports: [],
      };
    }

    TelegramModule.logger.log('Telegram integration is ENABLED');

    return {
      module: TelegramModule,
      imports: [
        TelegrafModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            token: configService.get<string>('TELEGRAM_BOT_TOKEN') || '',
          }),
        }),
        TypeOrmModule.forFeature([TelegramUser]),
        VehicleModule,
        MaintenanceModule,
      ],
      providers: [TelegramService, TelegramUpdate],
      exports: [TelegramService],
    };
  }

  /**
   * Reads TELEGRAM_ENABLED from process.env.
   * Defaults to false if not set or invalid value, to avoid accidentally
   * starting the bot in environments without a token.
   */
  private static isEnabled(): boolean {
    const raw = (process.env.TELEGRAM_ENABLED ?? '').trim().toLowerCase();
    return raw === 'true' || raw === '1' || raw === 'yes';
  }
}
