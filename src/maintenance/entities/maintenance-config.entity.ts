import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { MaintenanceProfile } from './maintenance-profile.entity';
import { MaintenanceLog } from './maintenance-log.entity';
import { MaintenanceType } from '../domain/maintenance-type.enum';
import { BaseEntity } from '../../common/entities/base.entity';
import { IMaintenanceConfig } from '../../common/interfaces/maintenance.interface';

@Entity('maintenance_configs')
export class MaintenanceConfig extends BaseEntity implements IMaintenanceConfig {
  /**
   * profileId identifies which MaintenanceProfile this config belongs to
   */
  @Column()
  profileId: string;

  @Column({ name: 'item_name', length: 100 })
  itemName: string;

  @Column({
    name: 'maintenance_type',
    type: 'varchar',
    length: 20,
    default: MaintenanceType.REPLACE,
  })
  maintenanceType: MaintenanceType;

  @Column({ name: 'interval_km', type: 'int', nullable: true })
  intervalKm: number | null;

  @Column({ type: 'int', nullable: true })
  intervalMonths: number | null;

  @ManyToOne(() => MaintenanceProfile, (profile) => profile.configs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  profile: MaintenanceProfile;

  @OneToMany(() => MaintenanceLog, (log) => log.config)
  logs: MaintenanceLog[];
}
