import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IVehicleRepository } from './interfaces/vehicle.repository.interface';
import { VEHICLE_REPOSITORY } from './interfaces/vehicle.repository.interface';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleRepository.create({
      name: dto.name,
      licensePlate: dto.licensePlate,
      initialOdo: dto.initialOdo,
      currentOdo: dto.initialOdo,
      purchaseDate: new Date(dto.purchaseDate),
    });
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const updateData: Partial<Vehicle> = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.licensePlate !== undefined) updateData.licensePlate = dto.licensePlate;
    if (dto.currentOdo !== undefined) updateData.currentOdo = dto.currentOdo;
    if (dto.purchaseDate !== undefined) updateData.purchaseDate = new Date(dto.purchaseDate);

    const vehicle = await this.vehicleRepository.update(id, updateData);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.vehicleRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
  }

  async bindProfile(vehicleId: string, profileId: string): Promise<void> {
    await this.vehicleRepository.update(vehicleId, { profileId });
  }

  async updateOdo(id: string, currentOdo: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.updateOdo(id, currentOdo);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }
}
