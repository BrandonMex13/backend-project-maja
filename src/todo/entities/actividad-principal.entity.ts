import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/core/users/entities/user.entity';
import { SubActividad } from './sub-actividad.entity';

export enum EstadoActividadPrincipal {
    ABIERTA = 'abierta',
    EN_PROGRESO = 'en_progreso',
    COMPLETADA = 'completada',
    CANCELADA = 'cancelada',
}

@Entity('actividades_principales')
export class ActividadPrincipal {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string | null;

    @Column({ name: 'usuario_asignado_id' })
    usuarioAsignadoId: number;

    @ManyToOne(() => User, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'usuario_asignado_id' })
    usuarioAsignado: User;

    @Column({ type: 'varchar', length: 32, default: EstadoActividadPrincipal.ABIERTA })
    estado: EstadoActividadPrincipal;

    @OneToMany(() => SubActividad, (s) => s.actividadPrincipal, { cascade: true })
    subActividades: SubActividad[];

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;
}
