import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('telegram_users')
export class TelegramUser extends BaseEntity {
  @Column({ name: 'telegram_id', type: 'bigint', unique: true })
  telegramId: number;

  @Column({ name: 'chat_id', type: 'bigint' })
  chatId: number;

  @Column({ name: 'username', type: 'varchar', length: 100, nullable: true })
  username: string | null;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ name: 'vehicle_id', type: 'uuid', nullable: true })
  vehicleId: string | null;

  @ManyToOne(() => Vehicle, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle | null;
}
