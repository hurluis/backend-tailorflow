import { Role } from "src/modules/roles/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum States {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

@Entity('EMPLOYEES')
export class Employee{
    @PrimaryGeneratedColumn()
    id_employee: number;

    @Column()
    id_role: number;

    @Column({length:15 ,unique: true})
    cc: number;

    @Column({type: 'varchar', length: 50})
    name: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @Column({default: States.ACTIVE})
    state: States;

    @ManyToOne(() => Role, role => role.employees)
    @JoinColumn({ name: 'id_role' })
    role: Role;
}