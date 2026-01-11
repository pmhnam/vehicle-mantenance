import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MaintenanceProfile } from '../../maintenance/entities/maintenance-profile.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { IVehicle } from '../../common/interfaces/vehicle.interface';

@Entity('vehicles')
export class Vehicle extends BaseEntity implements IVehicle {
  @Column({ length: 100 })
  name: string;

  @Column({ name: 'license_plate', length: 20, unique: true })
  licensePlate: string;

  @Column({ name: 'current_odo', type: 'int', default: 0 })
  currentOdo: number;

  @Column({ name: 'initial_odo', type: 'int', default: 0 })
  initialOdo: number;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date;

  @ManyToOne(() => MaintenanceProfile, (profile) => profile.vehicles, {
    nullable: true,
  })
  @JoinColumn({ name: 'profileId' })
  profile: MaintenanceProfile;

  @Column({ nullable: true })
  profileId: string;

  // Relationships will be added after MaintenanceConfig and MaintenanceLog entities are created
}
