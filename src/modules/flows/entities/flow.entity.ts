import { Category } from "src/modules/categories/entities/category.entity";
import { Role } from "src/modules/roles/entities/role.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";

@Entity('FLOWS')
@Unique(['id_category', 'sequence'])
export class Flow {

    @PrimaryColumn({name: 'ID_FLOW', type: 'number'})
    @Generated('increment')
    id_flow: number;

    @Column({ name: 'ID_CATEGORY', type: 'number' })
    id_category: number;

    @Column({ name: 'ID_ROLE', type: 'number' })
    id_role: number;

    @Column({name: 'SEQUENCE', type: 'number'})
    sequence: number;

    @ManyToOne(() => Role, (role) => role.flows)
    @JoinColumn({ name: 'ID_ROLE' })
    role: Role;

    @ManyToOne(() => Category, (category) => category.flows)
    @JoinColumn({ name: 'ID_CATEGORY' })
    category: Category;
    
}