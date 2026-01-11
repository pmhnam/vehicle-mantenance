import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IMaintenanceLog } from '../../common/interfaces/maintenance.interface';

export class LogMaintenanceDto implements Omit<IMaintenanceLog, 'performedAtDate'> {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Vehicle UUID' })
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Optional: Link to a maintenance config',
  })
  @IsUUID()
  @IsOptional()
  configId?: string;

  @ApiProperty({ example: 'Oil Change', description: 'Maintenance item name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  itemName: string;

  @ApiProperty({ example: 4500, description: 'Odometer reading when maintenance was performed' })
  @IsInt()
  @Min(0)
  performedAtKm: number;

  @ApiProperty({ example: '2024-06-15', description: 'Date when maintenance was performed' })
  @IsDateString()
  performedAtDate: string;

  @ApiPropertyOptional({ example: 150000, description: 'Cost in VND' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  cost?: number;

  @ApiPropertyOptional({ example: 'Changed oil at Honda dealership', description: 'Notes' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
