import { ViewEntity, ViewColumn } from 'typeorm';

/**
 * Vista de consumo de materiales por área
 * Corresponde a la vista VW_CONSUMO_MATERIALES en Oracle
 */
@ViewEntity({
  name: 'VW_CONSUMO_MATERIALES',
  synchronize: false // Las vistas no deben sincronizarse
})
export class ConsumoMaterialesView {
  @ViewColumn({ name: 'AREA' })
  area: string;

  @ViewColumn({ name: 'MATERIAL' })
  material: string;

  @ViewColumn({ name: 'TOTAL_CONSUMIDO' })
  total_consumido: number;

  @ViewColumn({ name: 'TAREAS_ASOCIADAS' })
  tareas_asociadas: number;
}
