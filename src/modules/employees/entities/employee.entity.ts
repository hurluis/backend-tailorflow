import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    id_area: number;

    @Column({unique: true})
    cc: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({default: States.ACTIVE})
    state: States;
}