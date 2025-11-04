import { Role } from "src/modules/roles/entities/role.entity";
import { Task } from "src/modules/tasks/entities/task.entity";
import { Column, Entity, JoinColumn, ManyToOne, Check, PrimaryColumn, Generated, OneToMany } from "typeorm";

export enum States {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

@Check(`"STATE" IN ('ACTIVE', 'INACTIVE')`)
@Entity('EMPLOYEES')
export class Employee {

  @PrimaryColumn({ name: 'ID_EMPLOYEE', type: 'number' })
  @Generated('increment')
  id_employee: number;

  @Column({ name: 'ID_ROLE', type: 'number' })
  id_role: number;

  @Column({ name: 'CC', type: 'varchar2', length: 20, unique: true })
  cc: string;

  @Column({ name: 'NAME', type: 'varchar2', length: 100 })
  name: string;

  @Column({ name: 'PASSWORD', type: 'varchar2', length: 255 })
  password: string;

  @Column({ name: 'STATE', type: 'varchar2', length: 20, default: States.ACTIVE })
  state: States;

  @ManyToOne(() => Role, role => role.employees, { nullable: false })
  @JoinColumn({ name: 'ID_ROLE' })
  role: Role;

  @OneToMany(() => Task, task => task.employee)
  tasks: Task[];
}
