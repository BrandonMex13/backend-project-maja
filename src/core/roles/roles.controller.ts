import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Put(':id/permissions')
  assignPermissions(
    @Param('id') id: number,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto.permissionIds);
  }
}
