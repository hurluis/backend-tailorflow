import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controlador y servicio
import { AdminViewsController } from './admin-views.controller';
import { AdminViewsService } from './admin-views.service';

// Entidades de vistas
import { DetalleProductoView } from './entities/detalle-producto.view';
import { ConsumoMaterialesView } from './entities/consumo-materiales.view';
import { AlertaStockMinimoView } from './entities/alerta-stock-minimo.view';
import { TareasAtrasadasView } from './entities/tareas-atrasadas.view';

/**
 * Módulo para gestionar las vistas de administrador
 * Proporciona endpoints protegidos para consultas analíticas y reportes
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DetalleProductoView,
      ConsumoMaterialesView,
      AlertaStockMinimoView,
      TareasAtrasadasView
    ])
  ],
  controllers: [AdminViewsController],
  providers: [AdminViewsService],
  exports: [AdminViewsService]
})
export class AdminViewsModule {}
