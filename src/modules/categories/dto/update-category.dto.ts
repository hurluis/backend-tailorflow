import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe contener letras' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe contener letras' })
  description?: string;
}
