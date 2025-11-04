import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMaterialDto {
    @IsInt({ message: 'El ID del área debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID del área es obligatorio' })
    id_area: number;

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre del material es obligatorio' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    name: string;

    @IsInt({ message: 'El stock actual debe ser un número entero' })
    @IsOptional()
    @Min(0, { message: 'El stock actual no puede ser negativo' })
    current_stock?: number = 0;

    @IsInt({ message: 'El stock mínimo debe ser un número entero' })
    @IsOptional()
    @Min(0, { message: 'El stock mínimo no puede ser negativo' })
    min_stock?: number = 0;
}