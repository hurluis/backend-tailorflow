import { Employee } from "src/modules/employees/entities/employee.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('ROLES')
export class Role{
    @PrimaryGeneratedColumn()
    id_role: number;

    //ESTO PARA ORACLE
    /*@Column({type: 'varchar2', length: 50, unique: true})
    name: string;

    @Column({type: 'varchar2', length: 100, nullable: true})
    description: string;*/

    @Column({type: 'varchar', length: 50, unique: true})
    name: string;

    @Column({type: 'varchar', length: 100, nullable: true})
    description: string;

    @OneToMany(()=> Employee, emp => emp.role)
    employees: Employee[];
}