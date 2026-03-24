import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreateRoleDto) {
    const exists = await this.roleRepo.findOne({
      where: { name: dto.name },
    });

    if (exists) {
      throw new BadRequestException('El rol ya existe');
    }

    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  findAll() {
    return this.roleRepo.find();
  }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException('Rol no encontrado');
    }

    const permissions = await this.permissionRepo.findByIds(permissionIds);

    if (permissions.length !== permissionIds.length) {
      throw new BadRequestException('Uno o más permisos no existen');
    }

    role.permissions = permissions;
    return this.roleRepo.save(role);
  }
}
