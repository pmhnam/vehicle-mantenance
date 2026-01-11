import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUser } from './entities/telegram-user.entity';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { VehicleModule } from '../vehicle/vehicle.module';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({
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
})
export class TelegramModule {}
