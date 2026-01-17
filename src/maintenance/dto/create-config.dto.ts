import { IsString, IsNotEmpty, IsInt, IsOptional, Min, MaxLength, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaintenanceType } from '../../maintenance/domain/maintenance-type.enum';

export class CreateConfigDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Profile UUID' })
  @IsUUID()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({ example: 'Oil Change', description: 'Maintenance item name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  itemName: string;

  @ApiProperty({ enum: MaintenanceType, example: MaintenanceType.REPLACE })
  @IsEnum(MaintenanceType)
  @IsOptional()
  maintenanceType: MaintenanceType;

  @ApiPropertyOptional({
    example: 2000,
    description: 'Interval in kilometers (e.g., every 2000km)',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  intervalKm?: number;

  @ApiPropertyOptional({
    example: 6,
    description: 'Interval in months (e.g., every 6 months)',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  intervalMonths?: number;
}

