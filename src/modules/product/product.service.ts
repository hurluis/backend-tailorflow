import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductResponseDto } from './dto/product-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { OrdersService } from '../orders/orders.service';
import { CategoriesService } from '../categories/categories.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        private readonly ordersService: OrdersService,
        private readonly categoriesService: CategoriesService
    ){}

    async findAll(): Promise<ProductResponseDto[]>{
        const products = await this.productRepository.find();

        if(!products || products.length === 0){
            throw new NotFoundException('No hay productos');
        }
        return products.map(product => plainToInstance(ProductResponseDto, product, {excludeExtraneousValues: true}))
    }

    async findById(id:number): Promise<ProductResponseDto>{
        const product = await this.productRepository.findOne({where: {id_product: id}, relations: ['order', 'category', 'state']});

        if(!product){
            throw new NotFoundException('Producto no existe');
        }

        return plainToInstance(ProductResponseDto, product, {excludeExtraneousValues: true});
    }

    async createProduct(createProduct: CreateProductDto): Promise<ProductResponseDto>{
        const existingOrder = await this.ordersService.findById(createProduct.id_order);
        if(!existingOrder) {
            throw new NotFoundException('La orden indicada no existe');
        }

        const existingCategory = await this.categoriesService.findById(createProduct.id_category)
        
        if(!existingCategory){
            throw new NotFoundException('La categoría indicada no existe');
        }

       const newProduct = this.productRepository.create(createProduct);
       newProduct.id_state = 1;
       const savedProduct = await this.productRepository.save(newProduct);

       return plainToInstance(ProductResponseDto, savedProduct, {excludeExtraneousValues: true})
        
    }

    async updateProduct(id: number, updatePoduct: UpdateProductDto): Promise<ProductResponseDto>{
        const existingProduct = await this.productRepository.preload({id_product: id, ...updatePoduct});

        if(!existingProduct){
            throw new NotFoundException('El producto no existe')
        }

        if(existingProduct.id_state != 1){
            throw new BadRequestException('El producto ya se encuentra en producción, no puedes cambiarlo');
        }

        const savedProduct = this.productRepository.save(existingProduct);
        return plainToInstance(ProductResponseDto, savedProduct, {excludeExtraneousValues: true})

    }

    async deleteProduct(id: number){
        const existingProduct = await this.productRepository.findOneBy({id_product: id});

        if(!existingProduct){
            throw new NotFoundException('El producto no existe')
        }

        if(existingProduct.id_state != 1){
            throw new BadRequestException('El producto ya se encuentra en producción, no puedes eliminarlo');
        }

        const deletedProduct = await this.productRepository.remove(existingProduct);
        return plainToInstance(ProductResponseDto, deletedProduct, {excludeExtraneousValues: true});
    }
       
}
