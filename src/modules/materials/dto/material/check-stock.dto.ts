import { IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class MaterialToCheck {
  @IsNumber()
  id_material: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CheckStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialToCheck)
  materials: MaterialToCheck[];
}