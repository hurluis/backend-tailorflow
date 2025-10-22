import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Material } from "./material.entity";

@Entity('MATERIAL_CONSUMPTION')
export class MaterialConsumption{

    @PrimaryColumn({name: 'ID_CONSUMPTION', type: 'number'})
    @Generated('increment')
    id_consumption: number;

    @Column({ name: 'ID_MATERIAL', type: 'number', precision: 10 })
    id_material: number;

    @Column({ name: 'ID_TASK', type: 'number', precision: 10 })
    id_task: number;

    @Column({ name: 'QUANTITY', type: 'number', precision: 10, nullable: false, default: 0 })
    quantity: number;

    @ManyToOne(() => Material, material => material.consumptions)
    @JoinColumn({ name: 'ID_MATERIAL' }) 
    material: Material;

    /*
    @ManyToOne(() => Task, task => task.materialConsumptions)
    @JoinColumn({ name: 'ID_TASK' }) // Especifica la columna FK
    task: Task;*/
}