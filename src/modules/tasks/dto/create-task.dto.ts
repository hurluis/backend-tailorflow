import { IsInt, IsNotEmpty, IsOptional, Min, Max, IsDateString } from 'class-validator';

export class CreateTaskDto {
    
    @IsInt({ message: 'El ID del producto debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
    id_product: number;

    @IsInt({ message: 'El ID del área debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID del área es obligatorio' })
    id_area: number;

    @IsInt({ message: 'El ID del empleado debe ser un número entero' })
    @IsOptional()
    id_employee?: number;

    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida (YYYY-MM-DD)' })
    @IsOptional()
    start_date?: Date;

    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida (YYYY-MM-DD)' })
    @IsOptional()
    end_date?: Date;
}