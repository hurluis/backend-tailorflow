import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { OrdersModule } from '../orders/orders.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), OrdersModule, CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
