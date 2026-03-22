import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/core/users/entities/user.entity';
import { CrearActividadPrincipalDto } from '../dto/crear-actividad-principal.dto';
import { ActualizarActividadPrincipalDto } from '../dto/actualizar-actividad-principal.dto';
import { ActividadPrincipal, EstadoActividadPrincipal } from '../entities/actividad-principal.entity';
import { SubActividad } from '../entities/sub-actividad.entity';

export type ProgresoResumen = {
    hechas: number;
    total: number;
    porcentaje: number;
};

export type ActividadPrincipalRespuesta = Omit<ActividadPrincipal, 'usuarioAsignado'> & {
    usuarioAsignado: { id: number; nombre: string; correo: string };
    progreso: ProgresoResumen;
};

@Injectable()
export class ActividadesPrincipalesService {
    constructor(
        @InjectRepository(ActividadPrincipal)
        private readonly actividadesRepo: Repository<ActividadPrincipal>,
        @InjectRepository(User)
        private readonly usuariosRepo: Repository<User>,
    ) { }

    private datosPublicosUsuario(usuario: User) {
        return { id: usuario.id, nombre: usuario.name, correo: usuario.email };
    }

    private calcularProgreso(subActividades: SubActividad[]): ProgresoResumen {
        const total = subActividades.length;
        if (total === 0) {
            return { hechas: 0, total: 0, porcentaje: 0 };
        }
        const hechas = subActividades.filter((s) => s.completada).length;
        return {
            hechas,
            total,
            porcentaje: Math.round((hechas / total) * 100),
        };
    }

    private ordenarSubActividades(lista: SubActividad[]) {
        return [...lista].sort((a, b) => a.orden - b.orden || a.id - b.id);
    }

    private armarRespuesta(actividad: ActividadPrincipal): ActividadPrincipalRespuesta {
        const sub = actividad.subActividades ? this.ordenarSubActividades(actividad.subActividades) : [];
        const { usuarioAsignado, ...resto } = actividad;
        return {
            ...resto,
            subActividades: sub,
            usuarioAsignado: this.datosPublicosUsuario(usuarioAsignado),
            progreso: this.calcularProgreso(sub),
        };
    }

    async crear(dto: CrearActividadPrincipalDto): Promise<ActividadPrincipalRespuesta> {
        const usuario = await this.usuariosRepo.findOne({ where: { id: dto.idUsuarioAsignado } });
        if (!usuario) {
            throw new NotFoundException('No encontré al usuario al que querías asignarle la tarea');
        }

        const nueva = this.actividadesRepo.create({
            titulo: dto.titulo,
            descripcion: dto.descripcion ?? null,
            usuarioAsignadoId: dto.idUsuarioAsignado,
            estado: EstadoActividadPrincipal.ABIERTA,
        });

        const guardada = await this.actividadesRepo.save(nueva);
        const conRelaciones = await this.actividadesRepo.findOne({
            where: { id: guardada.id },
            relations: ['usuarioAsignado', 'subActividades'],
        });
        return this.armarRespuesta(conRelaciones!);
    }

    async listar(idUsuarioAsignado?: number): Promise<ActividadPrincipalRespuesta[]> {
        const condicion = idUsuarioAsignado != null ? { usuarioAsignadoId: idUsuarioAsignado } : {};
        const filas = await this.actividadesRepo.find({
            where: condicion,
            relations: ['usuarioAsignado', 'subActividades'],
            order: { id: 'DESC' },
        });
        return filas.map((f) => this.armarRespuesta(f));
    }

    async obtenerPorId(id: number): Promise<ActividadPrincipalRespuesta> {
        const fila = await this.actividadesRepo.findOne({
            where: { id },
            relations: ['usuarioAsignado', 'subActividades'],
        });
        if (!fila) {
            throw new NotFoundException('Esa actividad principal no está en el sistema');
        }
        return this.armarRespuesta(fila);
    }

    async actualizar(id: number, dto: ActualizarActividadPrincipalDto): Promise<ActividadPrincipalRespuesta> {
        const fila = await this.actividadesRepo.findOne({ where: { id } });
        if (!fila) {
            throw new NotFoundException('Esa actividad principal no está en el sistema');
        }

        if (dto.idUsuarioAsignado != null) {
            const usuario = await this.usuariosRepo.findOne({ where: { id: dto.idUsuarioAsignado } });
            if (!usuario) {
                throw new NotFoundException('No encontré al usuario al que querías asignarle la tarea');
            }
        }

        Object.assign(fila, {
            ...(dto.titulo !== undefined && { titulo: dto.titulo }),
            ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
            ...(dto.idUsuarioAsignado !== undefined && { usuarioAsignadoId: dto.idUsuarioAsignado }),
            ...(dto.estado !== undefined && { estado: dto.estado }),
        });

        await this.actividadesRepo.save(fila);

        const conRelaciones = await this.actividadesRepo.findOne({
            where: { id },
            relations: ['usuarioAsignado', 'subActividades'],
        });
        return this.armarRespuesta(conRelaciones!);
    }

    async eliminar(id: number): Promise<void> {
        const resultado = await this.actividadesRepo.delete(id);
        if (!resultado.affected) {
            throw new NotFoundException('Esa actividad principal no está en el sistema');
        }
    }
}
