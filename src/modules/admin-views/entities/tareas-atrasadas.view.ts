import { ViewEntity, ViewColumn } from 'typeorm';

/**
 * Vista de tareas que están en proceso y llevan tiempo
 * Corresponde a la vista VW_TAREAS_ATRASADAS en Oracle
 */
@ViewEntity({
  name: 'VW_TAREAS_ATRASADAS',
  synchronize: false // Las vistas no deben sincronizarse
})
export class TareasAtrasadasView {
  @ViewColumn({ name: 'ID_TAREA' })
  id_tarea: number;

  @ViewColumn({ name: 'AREA_PRODUCCION' })
  area_produccion: string;

  @ViewColumn({ name: 'EMPLEADO_ASIGNADO' })
  empleado_asignado: string;

  @ViewColumn({ name: 'FECHA_INICIO_REAL' })
  fecha_inicio_real: Date;

  @ViewColumn({ name: 'DIAS_EN_CURSO' })
  dias_en_curso: number;

  @ViewColumn({ name: 'ID_PRODUCTO_AFECTADO' })
  id_producto_afectado: number;
}
