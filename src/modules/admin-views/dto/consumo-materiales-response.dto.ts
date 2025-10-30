import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para la vista VW_CONSUMO_MATERIALES
 */
export class ConsumoMaterialesResponseDto {
  @Expose()
  area: string;

  @Expose()
  material: string;

  @Expose()
  total_consumido: number;

  @Expose()
  tareas_asociadas: number;
}
