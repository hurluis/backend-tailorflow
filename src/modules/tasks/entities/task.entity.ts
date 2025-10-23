import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import { Employee } from "../../employees/entities/employee.entity";
import { Area } from "../../areas/entities/area.entity";
import { State } from "src/common/entities/state.entity";
import { MaterialConsumption } from "../../materials/entities/material-consumption.entity";

@Entity('TASKS')
@Index('UQ_TASKS_PROD_SEQ', ['id_product', 'sequence'], { unique: true })
export class Task {
    @PrimaryColumn({ name: 'ID_TASK', type: 'number'})
    @Generated('increment')
    id_task: number;

    @Column({ name: 'ID_PRODUCT', type: 'number', nullable: false })
    id_product: number;

    @Column({ name: 'ID_EMPLOYEE', type: 'number', nullable: true })
    id_employee: number;

    @Column({ name: 'ID_AREA', type: 'number',  nullable: false })
    id_area: number;

    @Column({ name: 'ID_STATE', type: 'number', nullable: false })
    id_state: number;

    @Column({ name: 'SEQUENCE', type: 'number', nullable: false })
    sequence: number;

    @Column({ name: 'START_DATE', type: 'date', nullable: true })
    start_date: Date;

    @Column({ name: 'END_DATE', type: 'date', nullable: true })
    end_date: Date;

    @ManyToOne(() => Product, product => product.tasks)
    @JoinColumn({ name: 'ID_PRODUCT' })
    product: Product;

    @ManyToOne(() => Employee, employee => employee.tasks)
    @JoinColumn({ name: 'ID_EMPLOYEE' })
    employee: Employee;

    @ManyToOne(() => Area, area => area.tasks)
    @JoinColumn({ name: 'ID_AREA' })
    area: Area;

    @ManyToOne(() => State, state => state.tasks)
    @JoinColumn({ name: 'ID_STATE' })
    state: State;

    @OneToMany(() => MaterialConsumption, consumption => consumption.task)
    materialConsumptions: MaterialConsumption[];
}