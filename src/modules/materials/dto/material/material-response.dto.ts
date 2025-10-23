import { Expose, Type } from 'class-transformer';
import { AreaResponseDto } from 'src/modules/areas/dto/area-respose.dto';
import { MaterialConsumptionResponseDto } from '../material-consumption/material-consumption-response.dto';

export class MaterialResponseDto {
    @Expose()
    id_material: number;

    @Expose()
    id_area: number;

    @Expose()
    name: string;

    @Expose()
    current_stock: number;

    @Expose()
    min_stock: number;

    @Expose()
    @Type(() => AreaResponseDto)
    area?: AreaResponseDto;

    @Expose()
    @Type(() => MaterialConsumptionResponseDto)
    consumptions?: MaterialConsumptionResponseDto[];
}