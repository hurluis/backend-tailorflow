import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { OrdersModule } from '../orders/orders.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), OrdersModule, CategoriesModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
