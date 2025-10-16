import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity('AREAS')
export class Area {
  @PrimaryGeneratedColumn()
  id_area: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;


}