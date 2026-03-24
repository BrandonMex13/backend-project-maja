import { PartialType } from '@nestjs/mapped-types';
import { CrearSubActividadDto } from './crear-sub-actividad.dto';

export class ActualizarSubActividadDto extends PartialType(CrearSubActividadDto) {}
