import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ROLES')
export class Role{
    @PrimaryGeneratedColumn()
    id_role: number;

    @Column({type: 'varchar2', length: 50, unique: true})
    name: string;

    @Column({type: 'varchar2', length: 100, nullable: true})
    description: string;
}