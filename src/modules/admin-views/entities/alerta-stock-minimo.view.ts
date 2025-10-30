import { ViewEntity, ViewColumn } from 'typeorm';

/**
 * Vista de alertas de materiales con stock bajo el mínimo
 * Corresponde a la vista VW_ALERTA_STOCK_MINIMO en Oracle
 */
@ViewEntity({
  name: 'VW_ALERTA_STOCK_MINIMO',
  synchronize: false // Las vistas no deben sincronizarse
})
export class AlertaStockMinimoView {
  @ViewColumn({ name: 'MATERIAL' })
  material: string;

  @ViewColumn({ name: 'AREA_ASOCIADA' })
  area_asociada: string;

  @ViewColumn({ name: 'STOCK_ACTUAL' })
  stock_actual: number;

  @ViewColumn({ name: 'STOCK_MINIMO' })
  stock_minimo: number;

  @ViewColumn({ name: 'DIFERENCIA' })
  diferencia: number;
}
