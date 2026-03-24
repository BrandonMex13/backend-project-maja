import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenusController } from './controller/menus.controller';
import { MenusService } from './services/menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService]
})
export class MenusModule {}