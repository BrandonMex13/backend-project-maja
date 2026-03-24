import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { SubActividadesService } from '../services/sub-actividades.service';
import { CrearSubActividadDto } from '../dto/crear-sub-actividad.dto';
import { ActualizarSubActividadDto } from '../dto/actualizar-sub-actividad.dto';
import { JwtAuthGuard } from 'src/core/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/core/common/guards/permissions.guard';

@Controller('todo/actividades-principales/:actividadPrincipalId/sub-actividades')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubActividadesAnidadasController {
  constructor(private readonly subActividades: SubActividadesService) {}

  @Post()
  crear(
    @Param('actividadPrincipalId', ParseIntPipe) actividadPrincipalId: number,
    @Body() dto: CrearSubActividadDto,
  ) {
    return this.subActividades.crear(actividadPrincipalId, dto);
  }

  @Get()
  listar(@Param('actividadPrincipalId', ParseIntPipe) actividadPrincipalId: number) {
    return this.subActividades.listarPorActividadPrincipal(actividadPrincipalId);
  }
}

@Controller('todo/sub-actividades')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubActividadesController {
  constructor(private readonly subActividades: SubActividadesService) {}

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarSubActividadDto) {
    return this.subActividades.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.subActividades.eliminar(id);
  }
}
