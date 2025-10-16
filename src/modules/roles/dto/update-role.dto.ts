import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateRoleDto{
    
    @IsOptional()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @IsString({message: 'El nombre debe contener letras'})
    name?: string;

    @IsOptional()
    @IsNotEmpty({message:'La descripción es obligatoria'})
    @IsString({message: 'La descripción debe contener letras'})
    description?: string;
    
}