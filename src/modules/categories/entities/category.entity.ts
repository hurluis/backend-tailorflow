import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CATEGORY')
export class Category {
  @PrimaryGeneratedColumn()
  id_category: number;

  @Column({ type: 'varchar', length: 250, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

}
