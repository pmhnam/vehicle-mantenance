import { IsString, IsNotEmpty, IsInt, IsOptional, Min, MaxLength, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IMaintenanceConfig } from '../../common/interfaces/maintenance.interface';
import { MaintenanceType } from '../../maintenance/domain/maintenance-type.enum';

export class CreateConfigDto implements Omit<IMaintenanceConfig, 'profileId'> {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Vehicle UUID' })
  // Note: vehicleId is NOT in IMaintenanceConfig (Config belongs to Profile, not Vehicle directly created via Vehicle context sometimes? Wait.
  // Let's check existing code. CreateConfigDto has vehicleId?
  // MaintenanceConfig has profileId.
  // The existing CreateConfigDto seems to be creating a config for a specific vehicle?
  // But Configs are linked to Profiles.
  // If this DTO is used to add custom config to a vehicle-specific profile?
  // Or is it adding to the profile OF the vehicle?
  // Let's assume the latter. But the Interface IMaintenanceConfig has profileId.
  // This DTO has vehicleId. So it does NOT implement IMaintenanceConfig directly regarding that field.
  // It implements strict subset of fields: itemName, maintenanceType, intervalKm, intervalMonths.
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

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
