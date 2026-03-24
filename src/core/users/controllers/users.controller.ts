import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/core/common/guards/permissions.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('para-asignacion')
    listarParaAsignacion() {
        return this.usersService.listarParaAsignacion();
    }

    @Post()
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }
}
