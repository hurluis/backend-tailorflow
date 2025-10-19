import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService){}

    @Get()
    async findAll(): Promise<BaseApplicationResponseDto<OrderResponseDto[]>>{
        const orders = await this.ordersService.findAll()
        return{
            statusCode: 200, 
            message: 'Pedidos obtenidos correctamente',
            data: orders
        }
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<BaseApplicationResponseDto<OrderResponseDto>>{
        const order = await this.ordersService.findById(+id)
        return{
            statusCode: 200, 
            message: 'Pedido obtenido correctamente',
            data: order
        }
    }

    @Post()
    async createOrder(@Body() newOrder: CreateOrderDto): Promise<BaseApplicationResponseDto<OrderResponseDto>>{
        const order = await this.ordersService.createOrder(newOrder)
        return{
            statusCode: 201, 
            message: 'Pedido creado correctamente',
            data: order
        }
    }

    @Patch(':id')
    async updateOrder(@Param('id') id: string, @Body() updateOrder: UpdateOrderDto): Promise<BaseApplicationResponseDto<OrderResponseDto>>{
        const updatedOrder = await this.ordersService.updateOrder(+id, updateOrder);
        return{
            statusCode: 202, 
            message: 'Pedido actualizado correctamente',
            data: updatedOrder
        }
    }

}
