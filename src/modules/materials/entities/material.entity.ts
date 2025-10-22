import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import { MaterialConsumption } from "./material-consumption.entity";
import { Area } from "src/modules/areas/entities/area.entity";

@Entity('MATERIALS')
@Index('UQ_MATERIALS_AREA_NAME', ['id_area', 'name'], { unique: true })
export class Material{
    @PrimaryColumn({name: 'ID_MATERIAL', type: 'number'})
    @Generated('increment')
    id_material: number;

    @Column({name:'ID_AREA', type: 'number', nullable: false})
    id_area: number;

    @Column({name: 'NAME', type: 'varchar2', length:100, nullable:false})
    name: string;

    @Column({name: 'CURRENT_STOCK', type: 'number', nullable: false, default: 0})
    current_stock: number;

    @Column({name: 'MIN_STOCK', type: 'number', nullable: false, default: 0})
    min_stock: number;
    
    @OneToMany(() => MaterialConsumption, consumption => consumption.material)
    consumptions: MaterialConsumption[];

    @ManyToOne(() => Area, area => area.materials)
    @JoinColumn({ name: 'ID_AREA' })
    area: Area;
}