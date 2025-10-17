  import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';  
@Entity('CATEGORY')
export class Category {

  @PrimaryColumn({ name: 'ID_CATEGORY', type: 'number' })  
  @Generated('increment')
  id_category: number;

  @Column({ name: 'NAME', type: 'varchar2', length: 50,  unique: true })
  name: string;

  @Column({ name: 'DESCRIPTION', type: 'varchar2',  length: 100,  nullable: true })
  description: string;
}
