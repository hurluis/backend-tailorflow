import { Expose } from 'class-transformer';

export class ProductLocationDto {
  // Información General del Producto
  @Expose()
  id_product: number;

  @Expose()
  product_name: string;

  @Expose()
  category: string;

  @Expose()
  general_product_status: string;

  // Información del Pedido
  @Expose()
  id_order: number;

  @Expose()
  customer: string;

  // Información de la Tarea Actual
  @Expose()
  id_task: number;

  @Expose()
  process_number: number;

  @Expose()
  task_status: string;

  // Área de Producción
  @Expose()
  id_area: number;

  @Expose()
  production_area: string;

  // Trabajador Asignado
  @Expose()
  worker: string;

  @Expose()
  worker_cc: string;

  @Expose()
  worker_role: string;

  // Fechas
  @Expose()
  start_date: string;

  @Expose()
  end_date: string;

  // Progreso
  @Expose()
  task_progress: string;

  @Expose()
  total_tasks: number;

  @Expose()
  completed_tasks: number;

  // Siguiente área
  @Expose()
  next_area: string;

  // Materiales
  @Expose()
  consumed_materials: string;
}