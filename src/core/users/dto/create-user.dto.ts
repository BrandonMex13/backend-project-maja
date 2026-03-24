import { IsEmail, IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  roleIds?: number[];
}