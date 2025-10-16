import { IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateEmployeeDto{

    @IsNotEmpty({message: 'El ID de rol es obligatorio'})
    @IsInt({message: 'El ID de rol debe ser un número'})
    id_role: number;
    
    @IsNotEmpty({message: 'La cédula es obligatoria'})
    @IsInt({message: 'La cédula debe ser digitada sin puntos'})
    cc: number;
    
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @IsString({message: 'El nombre debe contener letras'})
    name: string;

    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    @IsString({message: 'La contraseña debe contener letras'})
    password: string;

}