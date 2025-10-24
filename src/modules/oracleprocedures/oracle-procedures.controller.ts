import { Controller, Get, Param } from '@nestjs/common';
import { OracleProceduresService } from './oracle-procedures.service';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { OrderTrackingDto } from './dto/order-tracking.dto';
import { ProductLocationDto } from './dto/product-location.dto';

@Controller('oracle-procedures')
export class OracleProceduresController {
  constructor(private readonly oracleProceduresService: OracleProceduresService) {}

  @Get('order-tracking/:id')
  async getOrderTracking(@Param('id') orderId: string): Promise<BaseApplicationResponseDto<OrderTrackingDto[]>> {
    const tracking = await this.oracleProceduresService.getOrderTracking(+orderId);
    return {
      statusCode: 200,
      message: 'Seguimiento de pedido obtenido correctamente',
      data: tracking
    };
  }

  @Get('product-location/:id')
  async getProductLocation(@Param('id') productId: string): Promise<BaseApplicationResponseDto<ProductLocationDto[]>> {
    const location = await this.oracleProceduresService.getProductLocation(+productId);
    return {
      statusCode: 200,
      message: 'Ubicación del producto obtenida correctamente',
      data: location
    };
  }
} 