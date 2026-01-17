import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ description: 'Profile name', example: 'Honda Airblade (HCM)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique profile code (uppercase with underscores)',
    example: 'HONDA_AIRBLADE_HCM',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'Code must be uppercase letters, numbers, and underscores only, starting with a letter',
  })
  code: string;

  @ApiPropertyOptional({ description: 'Profile description' })
  @IsString()
  @IsOptional()
  description?: string;
}
