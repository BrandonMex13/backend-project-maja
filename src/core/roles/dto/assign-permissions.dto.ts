import { IsArray, ArrayNotEmpty } from 'class-validator';

export class AssignPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  permissionIds: number[];
}
