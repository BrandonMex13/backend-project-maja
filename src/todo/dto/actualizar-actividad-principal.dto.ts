import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CrearActividadPrincipalDto } from './crear-actividad-principal.dto';
import { EstadoActividadPrincipal } from '../entities/actividad-principal.entity';

export class ActualizarActividadPrincipalDto extends PartialType(CrearActividadPrincipalDto) {
  @IsOptional()
  @IsEnum(EstadoActividadPrincipal)
  estado?: EstadoActividadPrincipal;
}
