import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MenusService } from '../menus/services/menus.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private menusService: MenusService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return user;
    }

    async login(user: any) {
        const roles = user.roles.map((r) => r.name);
        const permissions = user.roles.flatMap((r) =>
            r.permissions.map((p) => p.key),
        );

        const menus = await this.menusService.findMenusByPermissions(permissions);

        const payload = {
            sub: user.id,
            email: user.email,
            roles,
            permissions,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles,
            },
            menus,
        };
    }
}
