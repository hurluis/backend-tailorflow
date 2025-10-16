import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty({ message: 'El nombre del área es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena' })
  name: string;
}