import { IsInt, IsOptional, Min, Max, IsDateString } from 'class-validator';

export class UpdateTaskDto  {
    
    @IsInt({ message: 'El ID del estado debe ser un número entero' })
    @IsOptional()
    id_state?: number;

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