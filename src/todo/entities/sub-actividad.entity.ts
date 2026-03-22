import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ActividadPrincipal } from './actividad-principal.entity';

@Entity('sub_actividades')
export class SubActividad {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string | null;

    @Column({ default: false })
    completada: boolean;

    @Column({ type: 'int', default: 0 })
    orden: number;

    @Column({ name: 'actividad_principal_id' })
    actividadPrincipalId: number;

    @ManyToOne(() => ActividadPrincipal, (a) => a.subActividades, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'actividad_principal_id' })
    actividadPrincipal: ActividadPrincipal;

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn: Date;

    @UpdateDateColumn({ name: 'actualizado_en' })
    actualizadoEn: Date;
}
