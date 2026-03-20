import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMenuDto {

  @IsString()
  name: string;

  @IsString()
  route: string;

  @IsString()
  icon: string;

  @IsString()
  permission: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsNumber()
  order?: number;
}