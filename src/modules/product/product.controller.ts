import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private productsService: ProductService){}

    @Get()
    async findAll(): Promise<BaseApplicationResponseDto<ProductResponseDto[]>>{
        const products = await this.productsService.findAll();
        return{
            statusCode: 200, 
            message: 'Productos obtenidos correctamente',
            data: products
        }
    }

    @Get(':id')
    async finById(@Param('id') id: string): Promise<BaseApplicationResponseDto<ProductResponseDto>>{
        const product = await this.productsService.findById(+id);
        return{
            statusCode: 200, 
            message: 'Producto obtenido correctamente',
            data: product
        }
    }

    @Post()
    async createProduct(@Body() newProduct: CreateProductDto): Promise<BaseApplicationResponseDto<ProductResponseDto>>{
        const product = await this.productsService.createProduct(newProduct)
        return{
            statusCode: 201, 
            message: 'Producto creado correctamente',
            data: product
        }
    }

    @Patch(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProduct: UpdateProductDto): Promise<BaseApplicationResponseDto<ProductResponseDto>>{
        const product = await this.productsService.updateProduct(+id, updateProduct);
        return{
            statusCode: 202, 
            message: 'Producto actualizado correctamente',
            data: product
        }
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string){
        const product = this.productsService.deleteProduct(+id);
        return{
            statusCode: 202, 
            message:'Producto eliminado correctamente',
            data: product
        }
    }
}
