import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

// Entidades de vistas
import { DetalleProductoView } from './entities/detalle-producto.view';
import { ConsumoMaterialesView } from './entities/consumo-materiales.view';
import { AlertaStockMinimoView } from './entities/alerta-stock-minimo.view';
import { TareasAtrasadasView } from './entities/tareas-atrasadas.view';

// DTOs de respuesta
import { DetalleProductoResponseDto } from './dto/detalle-producto-response.dto';
import { ConsumoMaterialesResponseDto } from './dto/consumo-materiales-response.dto';
import { AlertaStockMinimoResponseDto } from './dto/alerta-stock-minimo-response.dto';
import { TareasAtrasadasResponseDto } from './dto/tareas-atrasadas-response.dto';

/**
 * Servicio para gestionar las vistas de administrador en Oracle
 * Proporciona acceso a vistas analíticas y de reportes
 */
@Injectable()
export class AdminViewsService {
  constructor(
    @InjectRepository(DetalleProductoView)
    private readonly detalleProductoRepository: Repository<DetalleProductoView>,

    @InjectRepository(ConsumoMaterialesView)
    private readonly consumoMaterialesRepository: Repository<ConsumoMaterialesView>,

    @InjectRepository(AlertaStockMinimoView)
    private readonly alertaStockMinimoRepository: Repository<AlertaStockMinimoView>,

    @InjectRepository(TareasAtrasadasView)
    private readonly tareasAtrasadasRepository: Repository<TareasAtrasadasView>,
  ) {}

  /**
   * Obtiene el detalle completo de todos los productos
   * @returns Lista de productos con toda su información relacionada
   */
  async getDetalleProductos(): Promise<DetalleProductoResponseDto[]> {
    const detalles = await this.detalleProductoRepository.find();

    if (!detalles || detalles.length === 0) {
      throw new NotFoundException('No se encontraron productos en el sistema');
    }

    return detalles.map(detalle =>
      plainToInstance(DetalleProductoResponseDto, detalle, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene el detalle de un producto específico por su ID
   * @param idProducto ID del producto a consultar
   * @returns Detalle del producto con toda su información relacionada
   */
  async getDetalleProductoPorId(idProducto: number): Promise<DetalleProductoResponseDto[]> {
    const detalles = await this.detalleProductoRepository.find({
      where: { id_producto: idProducto }
    });

    if (!detalles || detalles.length === 0) {
      throw new NotFoundException(`No se encontró información para el producto con ID ${idProducto}`);
    }

    return detalles.map(detalle =>
      plainToInstance(DetalleProductoResponseDto, detalle, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene el consumo de materiales agrupado por área
   * @returns Resumen de consumo de materiales por área
   */
  async getConsumoMateriales(): Promise<ConsumoMaterialesResponseDto[]> {
    const consumos = await this.consumoMaterialesRepository.find();

    if (!consumos || consumos.length === 0) {
      throw new NotFoundException('No se encontraron registros de consumo de materiales');
    }

    return consumos.map(consumo =>
      plainToInstance(ConsumoMaterialesResponseDto, consumo, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene el consumo de materiales filtrado por área
   * @param area Nombre del área a consultar
   * @returns Consumo de materiales para el área especificada
   */
  async getConsumoMaterialesPorArea(area: string): Promise<ConsumoMaterialesResponseDto[]> {
    const consumos = await this.consumoMaterialesRepository
      .createQueryBuilder('cm')
      .where('UPPER(cm.area) = UPPER(:area)', { area })
      .getMany();

    if (!consumos || consumos.length === 0) {
      throw new NotFoundException(`No se encontraron registros de consumo para el área ${area}`);
    }

    return consumos.map(consumo =>
      plainToInstance(ConsumoMaterialesResponseDto, consumo, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene alertas de materiales con stock bajo el mínimo
   * @returns Lista de materiales con stock crítico ordenados por stock actual
   */
  async getAlertasStockMinimo(): Promise<AlertaStockMinimoResponseDto[]> {
    const alertas = await this.alertaStockMinimoRepository.find();

    if (!alertas || alertas.length === 0) {
      return []; // No hay alertas es válido, devolvemos array vacío
    }

    return alertas.map(alerta =>
      plainToInstance(AlertaStockMinimoResponseDto, alerta, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene alertas de stock para materiales críticos (diferencia negativa)
   * @returns Lista de materiales con stock por debajo del mínimo
   */
  async getAlertasStockCritico(): Promise<AlertaStockMinimoResponseDto[]> {
    const alertas = await this.alertaStockMinimoRepository
      .createQueryBuilder('asm')
      .where('asm.diferencia < 0')
      .orderBy('asm.diferencia', 'ASC')
      .getMany();

    if (!alertas || alertas.length === 0) {
      return []; // No hay alertas críticas es válido
    }

    return alertas.map(alerta =>
      plainToInstance(AlertaStockMinimoResponseDto, alerta, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene tareas que están en proceso y llevan tiempo
   * @returns Lista de tareas atrasadas ordenadas por días en curso
   */
  async getTareasAtrasadas(): Promise<TareasAtrasadasResponseDto[]> {
    const tareas = await this.tareasAtrasadasRepository.find();

    if (!tareas || tareas.length === 0) {
      return []; // No hay tareas atrasadas es válido
    }

    return tareas.map(tarea =>
      plainToInstance(TareasAtrasadasResponseDto, tarea, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene tareas atrasadas filtradas por área de producción
   * @param area Nombre del área de producción
   * @returns Tareas atrasadas para el área especificada
   */
  async getTareasAtrasadasPorArea(area: string): Promise<TareasAtrasadasResponseDto[]> {
    const tareas = await this.tareasAtrasadasRepository
      .createQueryBuilder('ta')
      .where('UPPER(ta.area_produccion) = UPPER(:area)', { area })
      .orderBy('ta.dias_en_curso', 'DESC')
      .getMany();

    if (!tareas || tareas.length === 0) {
      return []; // No hay tareas atrasadas para esta área
    }

    return tareas.map(tarea =>
      plainToInstance(TareasAtrasadasResponseDto, tarea, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Obtiene tareas que exceden un número específico de días en curso
   * @param dias Número mínimo de días en curso
   * @returns Tareas que llevan más de los días especificados
   */
  async getTareasAtrasadasPorDias(dias: number): Promise<TareasAtrasadasResponseDto[]> {
    const tareas = await this.tareasAtrasadasRepository
      .createQueryBuilder('ta')
      .where('ta.dias_en_curso >= :dias', { dias })
      .orderBy('ta.dias_en_curso', 'DESC')
      .getMany();

    if (!tareas || tareas.length === 0) {
      return []; // No hay tareas con esa cantidad de días
    }

    return tareas.map(tarea =>
      plainToInstance(TareasAtrasadasResponseDto, tarea, {
        excludeExtraneousValues: true
      })
    );
  }
}
