import { Expose } from 'class-transformer';

export class OrderTrackingDto {
  @Expose({ name: 'ID_PEDIDO' }) 
  id_order: number;

  @Expose({ name: 'FECHA_ENTRADA' }) 
  entry_date: string;

  @Expose({ name: 'FECHA_ENTREGA_ESTIMADA' }) 
  estimated_delivery_date: string;

  @Expose({ name: 'ESTADO_PEDIDO' }) 
  order_state: string;

  @Expose({ name: 'ID_CLIENTE' }) 
  customer_id: number;

  @Expose({ name: 'NOMBRE_CLIENTE' }) 
  customer_name: string;

  @Expose({ name: 'TELEFONO_CLIENTE' }) 
  customer_phone: string;

  @Expose({ name: 'DIRECCION_CLIENTE' })
  customer_address: string;

  @Expose({ name: 'ID_PRODUCTO' }) 
  product_id: number;

  @Expose({ name: 'NOMBRE_PRODUCTO' })
  product_name: string;

  @Expose({ name: 'CATEGORIA_PRODUCTO' }) 
  product_category: string;

  @Expose({ name: 'ESTADO_PRODUCTO' }) 
  product_state: string;

  @Expose({ name: 'PERSONALIZADO' }) 
  customized: string;

  @Expose({ name: 'TELA' })
  fabric: string;

  @Expose({ name: 'DIMENSIONES' }) 
  dimensions: string;

  @Expose({ name: 'ID_TAREA' }) 
  task_id: number;

  @Expose({ name: 'SECUENCIA_TAREA' }) 
  task_sequence: number;

  @Expose({ name: 'AREA_PRODUCCION' }) 
  production_area: string;

  @Expose({ name: 'ESTADO_TAREA' }) 
  task_state: string;

  @Expose({ name: 'TRABAJADOR_ASIGNADO' }) 
  assigned_employee: string;

  @Expose({ name: 'CC_TRABAJADOR' }) 
  employee_cc: string;

  @Expose({ name: 'FECHA_INICIO_TAREA' }) 
  task_start_date: string;

  @Expose({ name: 'FECHA_FIN_TAREA' }) 
  task_end_date: string;

  @Expose({ name: 'DURACION_TAREA' }) 
  task_duration: string;
}