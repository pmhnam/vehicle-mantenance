import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { IVehicleRepository } from '../interfaces/vehicle.repository.interface';

@Injectable()
export class VehicleRepository implements IVehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicleRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find();
  }

  async create(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const entity = this.vehicleRepo.create(vehicle);
    return this.vehicleRepo.save(entity);
  }

  async update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    Object.assign(existing, vehicle);
    return this.vehicleRepo.save(existing);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.vehicleRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async updateOdo(id: string, currentOdo: number): Promise<Vehicle | null> {
    return this.update(id, { currentOdo });
  }
}
