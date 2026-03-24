import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('menus')
export class Menu {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  route: string;

  @Column()
  icon: string;

  @Column({ nullable: true })
  parentId: number;

  @Column()
  permission: string;

  @Column({ default: 0 })
  order: number;
}