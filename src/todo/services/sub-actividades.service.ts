import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearSubActividadDto } from '../dto/crear-sub-actividad.dto';
import { ActualizarSubActividadDto } from '../dto/actualizar-sub-actividad.dto';
import { ActividadPrincipal } from '../entities/actividad-principal.entity';
import { SubActividad } from '../entities/sub-actividad.entity';

@Injectable()
export class SubActividadesService {
    constructor(
        @InjectRepository(SubActividad)
        private readonly subRepo: Repository<SubActividad>,
        @InjectRepository(ActividadPrincipal)
        private readonly actividadesRepo: Repository<ActividadPrincipal>,
    ) { }

    private ordenar(lista: SubActividad[]) {
        return [...lista].sort((a, b) => a.orden - b.orden || a.id - b.id);
    }

    async crear(actividadPrincipalId: number, dto: CrearSubActividadDto): Promise<SubActividad> {
        const padre = await this.actividadesRepo.findOne({ where: { id: actividadPrincipalId } });
        if (!padre) {
            throw new NotFoundException('Primero tiene que existir la actividad principal');
        }

        const nueva = this.subRepo.create({
            titulo: dto.titulo,
            descripcion: dto.descripcion ?? null,
            completada: dto.completada ?? false,
            orden: dto.orden ?? 0,
            actividadPrincipalId,
        });

        return this.subRepo.save(nueva);
    }

    async listarPorActividadPrincipal(actividadPrincipalId: number): Promise<SubActividad[]> {
        const padre = await this.actividadesRepo.findOne({ where: { id: actividadPrincipalId } });
        if (!padre) {
            throw new NotFoundException('Primero tiene que existir la actividad principal');
        }

        const filas = await this.subRepo.find({
            where: { actividadPrincipalId },
            order: { orden: 'ASC', id: 'ASC' },
        });
        return this.ordenar(filas);
    }

    async actualizar(id: number, dto: ActualizarSubActividadDto): Promise<SubActividad> {
        const fila = await this.subRepo.findOne({ where: { id } });
        if (!fila) {
            throw new NotFoundException('No encontré esa sub-actividad');
        }

        Object.assign(fila, {
            ...(dto.titulo !== undefined && { titulo: dto.titulo }),
            ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
            ...(dto.completada !== undefined && { completada: dto.completada }),
            ...(dto.orden !== undefined && { orden: dto.orden }),
        });

        return this.subRepo.save(fila);
    }

    async eliminar(id: number): Promise<void> {
        const resultado = await this.subRepo.delete(id);
        if (!resultado.affected) {
            throw new NotFoundException('No encontré esa sub-actividad');
        }
    }
}
