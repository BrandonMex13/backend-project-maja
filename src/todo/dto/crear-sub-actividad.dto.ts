import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CrearSubActividadDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
}
