import { IsEnum, IsOptional, IsString } from "class-validator";
import { States } from "../entities/employee.entity";

export class UpdateEmployeeDto{

    @IsOptional()
    @IsString({ message: 'La contraseña debe contener letras o números válidos' })
    password?: string;
    
    @IsOptional()
    @IsEnum(States, { message: 'El estado debe ser ACTIVE o INACTIVE' })
    state?: States;
}