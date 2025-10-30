import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para la vista VW_ALERTA_STOCK_MINIMO
 */
export class AlertaStockMinimoResponseDto {
  @Expose()
  material: string;

  @Expose()
  area_asociada: string;

  @Expose()
  stock_actual: number;

  @Expose()
  stock_minimo: number;

  @Expose()
  diferencia: number;
}
