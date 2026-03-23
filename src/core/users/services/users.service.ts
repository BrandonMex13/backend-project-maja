import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/core/roles/entities/role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } });
    }

    /** Lista mínima para selects de asignación (sin contraseña). */
    async listarParaAsignacion(): Promise<{ id: number; nombre: string; correo: string }[]> {

        const filas = await this.userRepo.find({
            select: ['id', 'name', 'email'],
            where: { isActive: true },
            order: { id: 'ASC' },
        });

        return filas.map((u) => ({
            id: u.id,
            nombre: u.name,
            correo: u.email,
        }));
        
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password, roleIds } = createUserDto;

        const exists = await this.findByEmail(email);
        if (exists) {
            throw new BadRequestException('El correo ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let roles: Role[] = [];

        if (roleIds && roleIds.length > 0) {
            roles = await this.roleRepo.findByIds(roleIds);

            if (roles.length !== roleIds.length) {
                throw new BadRequestException('Uno o más roles no existen');
            }
        }

        const user = this.userRepo.create({
            name,
            email,
            password: hashedPassword,
            roles,
        });

        return this.userRepo.save(user);
    }
}
