import { Entity, PrimaryColumn, Column, OneToMany, Generated } from 'typeorm';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity('AREAS')
export class Area {
    
    @PrimaryColumn({ name: 'ID_AREA', type: 'number' })
    @Generated('increment') 
    id_area: number;
    
    @Column({ name: 'NAME', type: 'varchar2', length: 100, unique: true })
    name: string;
    
    @OneToMany(() => Role, role => role.area)
    roles: Role[];
}