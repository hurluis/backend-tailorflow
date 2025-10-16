import { Area } from "src/modules/areas/entities/area.entity";
import { Employee } from "src/modules/employees/entities/employee.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('ROLES')
export class Role{
    @PrimaryGeneratedColumn()
    id_role: number;

     @Column({ nullable: true })
    id_area: number;
    //ESTO PARA ORACLE
    /*@Column({type: 'varchar2', length: 50, unique: true})
    name: string;

    @Column({type: 'varchar2', length: 100, nullable: true})
    description: string;*/

    @Column({type: 'varchar', length: 50, unique: true})
    name: string;

    @Column({type: 'varchar', length: 100, nullable: true})
    description: string;

    @ManyToOne(() => Area, area => area.roles, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'id_area' })
    area: Area;

    @OneToMany(()=> Employee, emp => emp.role)
    employees: Employee[];
}