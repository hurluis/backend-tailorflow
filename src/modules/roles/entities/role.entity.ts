import { Area } from "src/modules/areas/entities/area.entity";
import { Employee } from "src/modules/employees/entities/employee.entity";
import { Flow } from "src/modules/flows/entities/flow.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Unique } from "typeorm";

@Entity('ROLES')
@Unique(['id_area', 'name'])
export class Role{
    
    @PrimaryColumn({ name: 'ID_ROLE', type: 'number'})
    @Generated('increment') 
    id_role: number;

    @Column({ name: 'ID_AREA', type: 'number' }) 
    id_area: number; 

    @Column({ name: 'NAME', type: 'varchar2', length: 50 }) 
    name: string; 

    @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 100, nullable: true }) 
    description: string;

    @ManyToOne(() => Area, area => area.roles, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'ID_AREA' })
    area: Area;

    @OneToMany(()=> Employee, emp => emp.role)
    employees: Employee[];

    @OneToMany(() => Flow, (flow) => flow.role)
    flows: Flow[];
}