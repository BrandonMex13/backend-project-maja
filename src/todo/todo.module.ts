import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/core/users/entities/user.entity';
import { ActividadPrincipal } from './entities/actividad-principal.entity';
import { SubActividad } from './entities/sub-actividad.entity';
import { ActividadesPrincipalesService } from './services/actividades-principales.service';
import { SubActividadesService } from './services/sub-actividades.service';
import { ActividadesPrincipalesController } from './controllers/actividades-principales.controller';
import {
  SubActividadesController,
  SubActividadesAnidadasController,
} from './controllers/sub-actividades.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActividadPrincipal, SubActividad, User])],
  controllers: [
    ActividadesPrincipalesController,
    SubActividadesAnidadasController,
    SubActividadesController,
  ],
  providers: [ActividadesPrincipalesService, SubActividadesService],
  exports: [ActividadesPrincipalesService, SubActividadesService],
})
export class TodoModule {}
