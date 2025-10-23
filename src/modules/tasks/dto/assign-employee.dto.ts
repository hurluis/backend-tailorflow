import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class AssignEmployeeDto {
    @IsInt({ message: 'El ID del empleado debe ser un número entero' })
    @IsOptional()
    id_employee?: number;
}