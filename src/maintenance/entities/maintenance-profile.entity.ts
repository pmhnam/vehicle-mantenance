import { Entity, Column, OneToMany } from 'typeorm';
import { MaintenanceConfig } from './maintenance-config.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('maintenance_profiles')
export class MaintenanceProfile extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => MaintenanceConfig, (config) => config.profile)
  configs: MaintenanceConfig[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.profile)
  vehicles: Vehicle[];
}
