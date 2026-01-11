import { Vehicle } from '../entities/vehicle.entity';

export const VEHICLE_REPOSITORY = 'VEHICLE_REPOSITORY';

export interface IVehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
  create(vehicle: Partial<Vehicle>): Promise<Vehicle>;
  update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle | null>;
  delete(id: string): Promise<boolean>;
  updateOdo(id: string, currentOdo: number): Promise<Vehicle | null>;
}
