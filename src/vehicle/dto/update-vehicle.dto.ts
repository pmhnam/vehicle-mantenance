import { IsString, IsOptional, IsInt, Min, IsDateString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IVehicle } from '../../common/interfaces/vehicle.interface';

export class UpdateVehicleDto implements Partial<Omit<IVehicle, 'purchaseDate'>> {
  @ApiPropertyOptional({ example: 'Honda Airblade 2024', description: 'Vehicle name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: '59-A1 12345', description: 'License plate number' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  licensePlate?: string;

  @ApiPropertyOptional({
    example: 5500,
    description: 'Current odometer reading (km) - update this after each trip',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  currentOdo?: number;

  @ApiPropertyOptional({ example: '2024-01-15', description: 'Purchase date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;
}
