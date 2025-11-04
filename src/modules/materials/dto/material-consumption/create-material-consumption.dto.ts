import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateMaterialConsumptionDto {
    @IsInt({ message: 'El ID del material debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID del material es obligatorio' })
    id_material: number;

    @IsInt({ message: 'El ID de la tarea debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID de la tarea es obligatorio' })
    id_task: number;

    @IsInt({ message: 'La cantidad debe ser un número entero' })
    @IsNotEmpty({ message: 'La cantidad es obligatoria' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    quantity: number;
}