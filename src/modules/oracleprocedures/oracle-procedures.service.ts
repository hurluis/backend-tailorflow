import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrderTrackingDto } from './dto/order-tracking.dto';
import { ProductLocationDto } from './dto/product-location.dto';
import { plainToInstance } from 'class-transformer';
import * as oracledb from 'oracledb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OracleProceduresService {
  private readonly dbConfig: any;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private configService: ConfigService,
  ) {
    // Initialize Oracle connection configuration
    this.dbConfig = {
      user: this.configService.get<string>('ORACLE_USER'),
      password: this.configService.get<string>('ORACLE_PASSWORD'),
      connectString: this.configService.get<string>('ORACLE_CONNECTION_STRING')
    };
  }

  async getOrderTracking(orderId: number): Promise<OrderTrackingDto[]> {
    const conn = await oracledb.getConnection(this.dbConfig);
    const result = await conn.execute(
      `BEGIN PKG_CENTRAL.sp_seguimiento_pedido(:p_id_order, :p_cursor); END;`,
      {
        p_id_order: orderId,
        p_cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rs = result.outBinds.p_cursor;
    const rows = await rs.getRows(1000);
    await rs.close();
    await conn.close();

    return rows.map(r => plainToInstance(OrderTrackingDto, {
      id_order: r.ID_PEDIDO, 
      entry_date: r.FECHA_ENTRADA, 
      estimated_delivery_date: r.FECHA_ENTREGA_ESTIMADA, 
      order_status: r.ESTADO_PEDIDO, 
      id_customer: r.ID_CLIENTE, 
      customer_name: r.NOMBRE_CLIENTE, 
      customer_phone: r.TELEFONO_CLIENTE, 
      customer_address: r.DIRECCION_CLIENTE,
      id_product: r.ID_PRODUCTO, 
      product_name: r.NOMBRE_PRODUCTO,
      product_category: r.CATEGORIA_PRODUCTO, 
      product_status: r.ESTADO_PRODUCTO, 
      customized: r.PERSONALIZADO, 
      fabric: r.TELA, 
      dimensions: r.DIMENSIONES, 
      id_task: r.ID_TAREA, 
      sequence: r.SECUENCIA_TAREA, 
      production_area: r.AREA_PRODUCCION, 
      task_status: r.ESTADO_TAREA, 
      assigned_worker_name: r.TRABAJADOR_ASIGNADO, 
      worker_cc: r.CC_TRABAJADOR, 
      task_start_date: r.FECHA_INICIO_TAREA, 
      task_end_date: r.FECHA_FIN_TAREA, 
      task_duration: r.DURACION_TAREA,

    }, { excludeExtraneousValues: false }));

  }

  async getProductLocation(productId: number): Promise<ProductLocationDto[]> {
    const conn = await oracledb.getConnection(this.dbConfig);

    try {
      const result = await conn.execute(
        `BEGIN PKG_CENTRAL.sp_ubicacion_producto(:p_id_product, :p_cursor); END;`,
        {
          p_id_product: productId,
          p_cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const rs = result.outBinds.p_cursor;
      const rows = await rs.getRows(1000);
      await rs.close();
      await conn.close();

      return rows.map(r => plainToInstance(ProductLocationDto, {
        id_product: r.ID_PRODUCTO,
        product_name: r.NOMBRE_PRODUCTO,
        category: r.CATEGORIA,
        general_product_status: r.ESTADO_GENERAL_PRODUCTO,
        id_order: r.ID_PEDIDO,
        customer: r.CLIENTE,
        id_task: r.ID_TAREA,
        process_number: r.PROCESO_NUMERO,
        task_status: r.ESTADO_TAREA,
        id_area: r.ID_AREA,
        production_area: r.AREA_PRODUCCION,
        worker: r.TRABAJADOR,
        worker_cc: r.CC_TRABAJADOR,
        worker_role: r.ROL_TRABAJADOR,
        start_date: r.FECHA_INICIO,
        end_date: r.FECHA_FINALIZACION,
        task_progress: r.PROGRESO_TAREA,
        total_tasks: r.TOTAL_TAREAS,
        completed_tasks: r.TAREAS_COMPLETADAS,
        next_area: r.SIGUIENTE_AREA,
        consumed_materials: r.MATERIALES_CONSUMIDOS,
      }, { excludeExtraneousValues: true }));

    } catch (error) {
      await conn.close();
      throw error;
    }
  }
}
