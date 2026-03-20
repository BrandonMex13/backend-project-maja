import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  key: string; // CREATE_USER, VIEW_POS, etc.

  @IsString()
  description?: string;
}