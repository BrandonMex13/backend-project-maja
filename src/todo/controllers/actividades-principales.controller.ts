import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ActividadesPrincipalesService } from '../services/actividades-principales.service';
import { CrearActividadPrincipalDto } from '../dto/crear-actividad-principal.dto';
import { ActualizarActividadPrincipalDto } from '../dto/actualizar-actividad-principal.dto';
import { JwtAuthGuard } from 'src/core/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/core/common/guards/permissions.guard';

@Controller('todo/actividades-principales')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ActividadesPrincipalesController {
    constructor(private readonly actividades: ActividadesPrincipalesService) { }

    @Post()
    crear(@Body() dto: CrearActividadPrincipalDto) {
        return this.actividades.crear(dto);
    }

    @Get()
    listar(@Query('idUsuarioAsignado') idUsuarioAsignado?: string) {
        if (idUsuarioAsignado == null || idUsuarioAsignado === '') {
            return this.actividades.listar();
        }
        const id = parseInt(idUsuarioAsignado, 10);
        if (Number.isNaN(id)) {
            throw new BadRequestException('El parámetro idUsuarioAsignado tiene que ser un número');
        }
        return this.actividades.listar(id);
    }

    @Get(':id')
    obtenerPorId(@Param('id', ParseIntPipe) id: number) {
        return this.actividades.obtenerPorId(id);
    }

    @Patch(':id')
    actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ActualizarActividadPrincipalDto,
    ) {
        return this.actividades.actualizar(id, dto);
    }

    @Delete(':id')
    eliminar(@Param('id', ParseIntPipe) id: number) {
        return this.actividades.eliminar(id);
    }
}
