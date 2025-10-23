import { State } from "src/common/entities/state.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('ORDERS')
export class Order {

    @PrimaryColumn({ name: 'ID_ORDER', type: 'number' })
    @Generated('increment')
    id_order: number;

    @Column({ name: 'ID_STATE', type: 'number', nullable: false, default: 1})
    id_state: number;

    @Column({ name: 'ID_CUSTOMER', type: 'number', nullable: false })
    id_customer: number;

    @CreateDateColumn({name: 'ENTRY_DATE', type: 'timestamp',default: () => 'SYSDATE'})
    entry_date: Date;

    @Column({name: 'ESTIMATED_DELIVERY_DATE',type: 'timestamp',nullable: true})
    estimated_delivery_date?: Date;

    @ManyToOne(() => State, (state) => state.orders)
    @JoinColumn({ name: 'ID_STATE' })
    state: State;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: 'ID_CUSTOMER' })
    customer: Customer;

    @OneToMany(() => Product, (product) => product.order)
    products: Product[];
}