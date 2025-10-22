import { Expose, Type } from 'class-transformer';
import { MaterialResponseDto } from '../material/material-response.dto';

export class MaterialConsumptionResponseDto {
    @Expose()
    id_consumption: number;

    @Expose()
    id_material: number;

    @Expose()
    id_task: number;

    @Expose()
    quantity: number;

    @Expose()
    @Type(() => MaterialResponseDto)
    material?: MaterialResponseDto;

    // cuando esté Task creado
    // @Expose()
    // @Type(() => TaskResponseDto)
    // task?: TaskResponseDto;
}