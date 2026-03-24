import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { MenusService } from '../services/menus.service';
import { JwtAuthGuard } from 'src/core/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/core/common/guards/permissions.guard';

@Controller('menus')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MenusController {

  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() dto: CreateMenuDto) {
    return this.menusService.create(dto);
  }

  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.menusService.remove(id);
  }
}