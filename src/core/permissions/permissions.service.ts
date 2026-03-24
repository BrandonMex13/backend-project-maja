import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto) {
    const exists = await this.permissionRepo.findOne({
      where: { key: dto.key },
    });

    if (exists) {
      throw new BadRequestException('El permiso ya existe');
    }

    const permission = this.permissionRepo.create(dto);
    return this.permissionRepo.save(permission);
  }

  findAll() {
    return this.permissionRepo.find();
  }
}
