import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BaseApplicationResponseDto } from '../../common/dto/base-application-response.dto';

import { AdminViewsService } from './admin-views.service';

// DTOs de respuesta
import { DetalleProductoResponseDto } from './dto/detalle-producto-response.dto';
import { ConsumoMaterialesResponseDto } from './dto/consumo-materiales-response.dto';
import { AlertaStockMinimoResponseDto } from './dto/alerta-stock-minimo-response.dto';
import { TareasAtrasadasResponseDto } from './dto/tareas-atrasadas-response.dto';

/**
 * Controlador para las vistas de administrador
 * TEMPORALMENTE SIN AUTENTICACIÓN - Solo para pruebas de desarrollo
 */
@Controller('admin-views')
export class AdminViewsController {
  constructor(private readonly adminViewsService: AdminViewsService) {}

  // ==================== DETALLE DE PRODUCTOS ====================

  /**
   * GET /admin-views/detalle-productos
   * Obtiene el detalle completo de todos los productos
   * @returns Lista de productos con toda su información relacionada
   */
  @Get('detalle-productos')
  async getDetalleProductos(): Promise<BaseApplicationResponseDto<DetalleProductoResponseDto[]>> {
    const productos = await this.adminViewsService.getDetalleProductos();
    return {
      statusCode: 200,
      message: 'Detalle de productos obtenido correctamente',
      data: productos
    };
  }

  /**
   * GET /admin-views/detalle-productos/:id
   * Obtiene el detalle de un producto específico por su ID
   * @param id ID del producto
   * @returns Detalle del producto con toda su información relacionada
   */
  @Get('detalle-productos/:id')
  async getDetalleProductoPorId(
    @Param('id', ParseIntPipe) id: number
  ): Promise<BaseApplicationResponseDto<DetalleProductoResponseDto[]>> {
    const detalle = await this.adminViewsService.getDetalleProductoPorId(id);
    return {
      statusCode: 200,
      message: `Detalle del producto ${id} obtenido correctamente`,
      data: detalle
    };
  }

  // ==================== CONSUMO DE MATERIALES ====================

  /**
   * GET /admin-views/consumo-materiales
   * Obtiene el consumo de materiales agrupado por área
   * @returns Resumen de consumo de materiales
   */
  @Get('consumo-materiales')
  async getConsumoMateriales(): Promise<BaseApplicationResponseDto<ConsumoMaterialesResponseDto[]>> {
    const consumos = await this.adminViewsService.getConsumoMateriales();
    return {
      statusCode: 200,
      message: 'Consumo de materiales obtenido correctamente',
      data: consumos
    };
  }

  /**
   * GET /admin-views/consumo-materiales/area/:area
   * Obtiene el consumo de materiales filtrado por área
   * @param area Nombre del área
   * @returns Consumo de materiales para el área especificada
   */
  @Get('consumo-materiales/area/:area')
  async getConsumoMaterialesPorArea(
    @Param('area') area: string
  ): Promise<BaseApplicationResponseDto<ConsumoMaterialesResponseDto[]>> {
    const consumos = await this.adminViewsService.getConsumoMaterialesPorArea(area);
    return {
      statusCode: 200,
      message: `Consumo de materiales del área ${area} obtenido correctamente`,
      data: consumos
    };
  }

  // ==================== ALERTAS DE STOCK MÍNIMO ====================

  /**
   * GET /admin-views/alertas-stock
   * Obtiene alertas de materiales con stock bajo el mínimo
   * @returns Lista de materiales con stock crítico
   */
  @Get('alertas-stock')
  async getAlertasStockMinimo(): Promise<BaseApplicationResponseDto<AlertaStockMinimoResponseDto[]>> {
    const alertas = await this.adminViewsService.getAlertasStockMinimo();
    return {
      statusCode: 200,
      message: alertas.length > 0
        ? 'Alertas de stock obtenidas correctamente'
        : 'No hay alertas de stock en este momento',
      data: alertas
    };
  }

  /**
   * GET /admin-views/alertas-stock/critico
   * Obtiene alertas de stock para materiales críticos (stock por debajo del mínimo)
   * @returns Lista de materiales con stock crítico
   */
  @Get('alertas-stock/critico')
  async getAlertasStockCritico(): Promise<BaseApplicationResponseDto<AlertaStockMinimoResponseDto[]>> {
    const alertas = await this.adminViewsService.getAlertasStockCritico();
    return {
      statusCode: 200,
      message: alertas.length > 0
        ? 'Alertas de stock crítico obtenidas correctamente'
        : 'No hay alertas de stock crítico en este momento',
      data: alertas
    };
  }

  // ==================== TAREAS ATRASADAS ====================

  /**
   * GET /admin-views/tareas-atrasadas
   * Obtiene tareas que están en proceso y llevan tiempo
   * @returns Lista de tareas atrasadas
   */
  @Get('tareas-atrasadas')
  async getTareasAtrasadas(): Promise<BaseApplicationResponseDto<TareasAtrasadasResponseDto[]>> {
    const tareas = await this.adminViewsService.getTareasAtrasadas();
    return {
      statusCode: 200,
      message: tareas.length > 0
        ? 'Tareas atrasadas obtenidas correctamente'
        : 'No hay tareas atrasadas en este momento',
      data: tareas
    };
  }

  /**
   * GET /admin-views/tareas-atrasadas/area/:area
   * Obtiene tareas atrasadas filtradas por área de producción
   * @param area Nombre del área de producción
   * @returns Tareas atrasadas para el área especificada
   */
  @Get('tareas-atrasadas/area/:area')
  async getTareasAtrasadasPorArea(
    @Param('area') area: string
  ): Promise<BaseApplicationResponseDto<TareasAtrasadasResponseDto[]>> {
    const tareas = await this.adminViewsService.getTareasAtrasadasPorArea(area);
    return {
      statusCode: 200,
      message: tareas.length > 0
        ? `Tareas atrasadas del área ${area} obtenidas correctamente`
        : `No hay tareas atrasadas en el área ${area}`,
      data: tareas
    };
  }

  /**
   * GET /admin-views/tareas-atrasadas/dias/:dias
   * Obtiene tareas que exceden un número específico de días en curso
   * @param dias Número mínimo de días en curso
   * @returns Tareas que llevan más de los días especificados
   */
  @Get('tareas-atrasadas/dias/:dias')
  async getTareasAtrasadasPorDias(
    @Param('dias', ParseIntPipe) dias: number
  ): Promise<BaseApplicationResponseDto<TareasAtrasadasResponseDto[]>> {
    const tareas = await this.adminViewsService.getTareasAtrasadasPorDias(dias);
    return {
      statusCode: 200,
      message: tareas.length > 0
        ? `Tareas con más de ${dias} días obtenidas correctamente`
        : `No hay tareas con más de ${dias} días en curso`,
      data: tareas
    };
  }
}
