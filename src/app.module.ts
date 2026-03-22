import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/auth/auth.module';
import { MenusModule } from './core/menus/menus.module';
import { PermissionsModule } from './core/permissions/permissions.module';
import { RolesModule } from './core/roles/roles.module';
import { UsersModule } from './core/users/users.module';
import { Menu } from './core/menus/entities/menu.entity';
import { Permission } from './core/permissions/entities/permission.entity';
import { Role } from './core/roles/entities/role.entity';
import { User } from './core/users/entities/user.entity';
import { SeedService } from './core/db/seed/seed.service';
import { ActividadPrincipal } from './todo/entities/actividad-principal.entity';
import { SubActividad } from './todo/entities/sub-actividad.entity';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot( {isGlobal: true} ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_POR!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [ Role, Permission, User, Menu, ActividadPrincipal, SubActividad ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Permission, Role, User]),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    MenusModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.run();
  }
}
