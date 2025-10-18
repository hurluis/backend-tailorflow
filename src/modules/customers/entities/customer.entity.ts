import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity('CUSTOMER')
export class Customer{
    @PrimaryColumn({name: 'ID_CUSTOMER', type: 'number'})
    @Generated('increment')
    id_customer: number;

    @Column({name: 'NAME', type: 'varchar2', length: 100, unique: true, nullable: false})
    name: string;

    @Column({name: 'ADDRESS', type: 'varchar2', length: 100})
    address: string;

    @Column({name: 'PHONE', type: 'varchar2', length: 15, nullable:false})
    phone: string;
}