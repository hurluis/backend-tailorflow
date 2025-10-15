import { IsEmpty, IsString } from "class-validator";

export class CreateRolDto{
    
    @IsEmpty({message: 'El nombre es obligatorio'})
    @IsString({message: 'El nombre debe contener letras'})
    name: string;

    @IsEmpty({message:'La descripción es obligatoria'})
    @IsString({message: 'La descripción debe contener letras'})
    description: string;
    
}