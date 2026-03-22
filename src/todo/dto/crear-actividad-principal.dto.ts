import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CrearActividadPrincipalDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  @Min(1)
  idUsuarioAsignado: number;
}
