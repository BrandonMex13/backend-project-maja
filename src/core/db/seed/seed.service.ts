import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Permission } from 'src/core/permissions/entities/permission.entity';
import { Role } from 'src/core/roles/entities/role.entity';
import { User } from 'src/core/users/entities/user.entity';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async run() {
        const permissions: Permission[] = [];
        const adminEmail = 'admin@admin.com';

        const BASE_PERMISSIONS = [
            { key: 'ADMIN', description: 'ADMIN' },
        ];

        for (const perm of BASE_PERMISSIONS) {
            let permission = await this.permissionRepo.findOne({
                where: { key: perm.key },
            });

            if (!permission) {
                permission = this.permissionRepo.create(perm);
                permission = await this.permissionRepo.save(permission);
            }

            permissions.push(permission);
        }

        /** 2️⃣ Rol ADMIN */
        let adminRole = await this.roleRepo.findOne({
            where: { name: 'ADMIN' },
        });

        if (!adminRole) {
            adminRole = this.roleRepo.create({
                name: 'ADMIN',
                description: 'Administrador del sistema',
                permissions,
            });

            adminRole = await this.roleRepo.save(adminRole);
        } else {
            adminRole.permissions = permissions;
            await this.roleRepo.save(adminRole);
        }

        let adminUser = await this.userRepo.findOne({
            where: { email: adminEmail },
        });

        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('12345', 10);

            adminUser = this.userRepo.create({
                name: 'Administrador',
                email: adminEmail,
                password: hashedPassword,
                roles: [adminRole],
                isActive: true,
            });

            await this.userRepo.save(adminUser);
        }
    }
}
