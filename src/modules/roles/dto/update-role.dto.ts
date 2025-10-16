import { IsEmpty, IsOptional, IsString } from "class-validator";

export class UpdateRoleDto{
    
    @IsOptional()
    @IsEmpty({message: 'El nombre es obligatorio'})
    @IsString({message: 'El nombre debe contener letras'})
    name?: string;

    @IsOptional()
    @IsEmpty({message:'La descripción es obligatoria'})
    @IsString({message: 'La descripción debe contener letras'})
    description?: string;
    
}