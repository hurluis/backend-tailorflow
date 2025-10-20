import { Entity, PrimaryColumn, Generated, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { State } from 'src/common/entities/state.entity';

@Entity('PRODUCTS')
export class Product {

  @PrimaryColumn({ name: 'ID_PRODUCT', type: 'number' })
  @Generated('increment')
  id_product: number;

  @Column({ name: 'ID_ORDER', type: 'number', nullable: false })
  id_order: number;

  @Column({ name: 'ID_CATEGORY', type: 'number', nullable: false })
  id_category: number;

  @Column({ name: 'ID_STATE', type: 'number', nullable: false, default: 1 })
  id_state: number;

  @Column({ name: 'NAME', type: 'varchar2', length: 100, nullable: false })
  name: string;

  @Column({ name: 'CUSTOMIZED', type: 'number', default: 0 })
  customized: number;

  @Column({ name: 'REF_PHOTO', type: 'varchar2', length: 255, nullable: true })
  ref_photo?: string;

  @Column({ name: 'DIMENSIONS', type: 'varchar2', length: 100, nullable: true })
  dimensions?: string;

  @Column({ name: 'FABRIC', type: 'varchar2', length: 100, nullable: true })
  fabric?: string;

  @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 300, nullable: true })
  description?: string;

  @ManyToOne(() => Order, (order) => order.id_order)
  @JoinColumn({ name: 'ID_ORDER' })
  order: Order;

  @ManyToOne(() => Category, (category) => category.id_category)
  @JoinColumn({ name: 'ID_CATEGORY' })
  category: Category;

  @ManyToOne(() => State, (state) => state.id_state)
  @JoinColumn({ name: 'ID_STATE' })
  state: State;
}
