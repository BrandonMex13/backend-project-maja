import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { Menu } from '../entities/menu.entity';

@Injectable()
export class MenusService {

    constructor(
        @InjectRepository(Menu)
        private menuRepository: Repository<Menu>,
    ) { }

    create(createMenuDto: CreateMenuDto) {
        const menu = this.menuRepository.create(createMenuDto);
        return this.menuRepository.save(menu);
    }

    findAll() {
        return this.menuRepository.find({
            order: { order: 'ASC' }
        });
    }

    findOne(id: number) {
        return this.menuRepository.findOneBy({ id });
    }

    update(id: number, dto: UpdateMenuDto) {
        return this.menuRepository.update(id, dto);
    }

    remove(id: number) {
        return this.menuRepository.delete(id);
    }

    async findMenusByPermissions(permissions: string[]) {
        return this.menuRepository.find({
            where: {
                permission: In(permissions)
            },
            order: {
                order: 'ASC'
            }
        });
    }

}