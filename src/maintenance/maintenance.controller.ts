import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { LogMaintenanceDto } from './dto/log-maintenance.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('vehicles/:id/maintenance-status')
  @ApiTags('vehicles')
  @ApiOperation({
    summary: 'Get maintenance status report',
    description:
      'Returns calculated maintenance status for all configured items. Status can be OK, DUE_SOON, or OVERDUE.',
  })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance status report with recommendations',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async getMaintenanceStatus(@Param('id', ParseUUIDPipe) vehicleId: string) {
    return this.maintenanceService.getMaintenanceStatus(vehicleId);
  }

  @Get('vehicles/:id/maintenance-configs')
  @ApiTags('vehicles')
  @ApiOperation({ summary: 'Get all maintenance configs for a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'List of maintenance configurations' })
  async getConfigs(@Param('id', ParseUUIDPipe) vehicleId: string) {
    return this.maintenanceService.getConfigsByVehicleId(vehicleId);
  }

  @Get('vehicles/:id/maintenance-logs')
  @ApiTags('vehicles')
  @ApiOperation({ summary: 'Get maintenance history for a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'List of maintenance logs' })
  async getLogs(@Param('id', ParseUUIDPipe) vehicleId: string) {
    return this.maintenanceService.getLogsByVehicleId(vehicleId);
  }

  @Post('maintenance/config')
  @ApiTags('maintenance')
  @ApiOperation({
    summary: 'Create maintenance config',
    description: 'Define maintenance rules (e.g., Oil change every 2000km or 6 months)',
  })
  @ApiResponse({ status: 201, description: 'Config created successfully' })
  async createConfig(@Body() dto: CreateConfigDto) {
    return this.maintenanceService.createConfig(dto);
  }

  @Post('maintenance/log')
  @ApiTags('maintenance')
  @ApiOperation({
    summary: 'Log maintenance activity',
    description: 'Record a maintenance activity that was performed',
  })
  @ApiResponse({ status: 201, description: 'Maintenance logged successfully' })
  async logMaintenance(@Body() dto: LogMaintenanceDto) {
    return this.maintenanceService.logMaintenance(dto);
  }

  @Put('maintenance/config/:id')
  @ApiTags('maintenance')
  @ApiOperation({ summary: 'Update a maintenance config' })
  @ApiParam({ name: 'id', description: 'Config UUID' })
  @ApiResponse({ status: 200, description: 'Config updated successfully' })
  @ApiResponse({ status: 404, description: 'Config not found' })
  async updateConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateConfigDto,
  ) {
    return this.maintenanceService.updateConfig(id, dto);
  }

  @Delete('maintenance/config/:id')
  @ApiTags('maintenance')
  @ApiOperation({ summary: 'Delete a maintenance config' })
  @ApiParam({ name: 'id', description: 'Config UUID' })
  @ApiResponse({ status: 200, description: 'Config deleted successfully' })
  async deleteConfig(@Param('id', ParseUUIDPipe) id: string) {
    await this.maintenanceService.deleteConfig(id);
    return { message: 'Maintenance config deleted successfully' };
  }

  @Delete('maintenance/log/:id')
  @ApiTags('maintenance')
  @ApiOperation({ summary: 'Delete a maintenance log' })
  @ApiParam({ name: 'id', description: 'Log UUID' })
  @ApiResponse({ status: 200, description: 'Log deleted successfully' })
  async deleteLog(@Param('id', ParseUUIDPipe) id: string) {
    await this.maintenanceService.deleteLog(id);
    return { message: 'Maintenance log deleted successfully' };
  }

  // Profile endpoints
  @Get('profiles')
  @ApiTags('profiles')
  @ApiOperation({ summary: 'Get all maintenance profiles' })
  @ApiResponse({ status: 200, description: 'List of maintenance profiles' })
  async getProfiles() {
    return this.maintenanceService.getAllProfiles();
  }

  @Get('profiles/:id/configs')
  @ApiTags('profiles')
  @ApiOperation({ summary: 'Get all maintenance configs for a profile' })
  @ApiParam({ name: 'id', description: 'Profile UUID' })
  @ApiResponse({ status: 200, description: 'List of maintenance configurations' })
  async getConfigsByProfile(@Param('id', ParseUUIDPipe) profileId: string) {
    return this.maintenanceService.getConfigsByProfileId(profileId);
  }

  @Get('profiles/:id')
  @ApiTags('profiles')
  @ApiOperation({ summary: 'Get a maintenance profile by ID' })
  @ApiParam({ name: 'id', description: 'Profile UUID' })
  @ApiResponse({ status: 200, description: 'The maintenance profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileById(@Param('id', ParseUUIDPipe) id: string) {
    return this.maintenanceService.getProfileById(id);
  }

  @Post('profiles')
  @ApiTags('profiles')
  @ApiOperation({ summary: 'Create a new maintenance profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  async createProfile(@Body() dto: CreateProfileDto) {
    return this.maintenanceService.createNewProfile(dto);
  }

  @Put('profiles/:id')
  @ApiTags('profiles')
  @ApiOperation({ summary: 'Update a maintenance profile' })
  @ApiParam({ name: 'id', description: 'Profile UUID' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProfileDto) {
    return this.maintenanceService.updateProfile(id, dto);
  }

  @Delete('profiles/:id')
  @ApiTags('profiles')
  @ApiOperation({ summary: 'Delete a maintenance profile' })
  @ApiParam({ name: 'id', description: 'Profile UUID' })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async deleteProfile(@Param('id', ParseUUIDPipe) id: string) {
    await this.maintenanceService.deleteProfile(id);
    return { message: 'Maintenance profile deleted successfully' };
  }
}
