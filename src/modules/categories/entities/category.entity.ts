  import { Flow } from 'src/modules/flows/entities/flow.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';  
@Entity('CATEGORY')
export class Category {

  @PrimaryColumn({ name: 'ID_CATEGORY', type: 'number' })  
  @Generated('increment')
  id_category: number;

  @Column({ name: 'NAME', type: 'varchar2', length: 50,  unique: true })
  name: string;

  @Column({ name: 'DESCRIPTION', type: 'varchar2',  length: 100,  nullable: true })
  description: string;

  @OneToMany(() => Flow, (flow) => flow.category)
  flows: Flow[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
} 
