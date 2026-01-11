import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { MaintenanceConfig } from './maintenance-config.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { IMaintenanceLog } from '../../common/interfaces/maintenance.interface';

@Entity('maintenance_logs')
export class MaintenanceLog extends BaseEntity implements IMaintenanceLog {
  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @Column({ name: 'config_id', nullable: true })
  configId: string | null;

  @Column({ name: 'item_name', length: 100 })
  itemName: string;

  @Column({ name: 'performed_at_km', type: 'int' })
  performedAtKm: number;

  @Column({ name: 'performed_at_date', type: 'date' })
  performedAtDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => MaintenanceConfig, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'config_id' })
  config: MaintenanceConfig | null;
}
