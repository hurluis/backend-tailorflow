import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto{
    
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @IsString({message: 'El nombre debe contener letras'})
    name: string;

    @IsNotEmpty({message:'La descripción es obligatoria'})
    @IsString({message: 'La descripción debe contener letras'})
    description: string;
    
}