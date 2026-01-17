import { IsString, IsNotEmpty, IsInt, Min, IsDateString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IVehicle } from '../../common/interfaces/vehicle.interface';

export class CreateVehicleDto implements Omit<IVehicle, 'purchaseDate' | 'currentOdo'> {
  @ApiProperty({ example: 'Honda Airblade 2024', description: 'Vehicle name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '59-A1 12345', description: 'License plate number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  licensePlate: string;

  @ApiProperty({ example: 0, description: 'Initial odometer reading (km)' })
  @IsInt()
  @Min(0)
  initialOdo: number;

  @ApiProperty({ example: '2024-01-15', description: 'Purchase date (YYYY-MM-DD)' })
  @IsDateString()
  purchaseDate: string;

  @ApiPropertyOptional({ description: 'Maintenance profile UUID' })
  @IsOptional()
  @IsUUID()
  profileId?: string;
}
