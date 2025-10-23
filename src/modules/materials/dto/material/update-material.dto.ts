import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateMaterialDto {

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    name?: string;

    @IsInt({ message: 'El stock actual debe ser un número entero' })
    @IsOptional()
    @Min(0, { message: 'El stock actual no puede ser negativo' })
    current_stock?: number;

    @IsInt({ message: 'El stock mínimo debe ser un número entero' })
    @IsOptional()
    @Min(0, { message: 'El stock mínimo no puede ser negativo' })
    min_stock?: number;
    
}