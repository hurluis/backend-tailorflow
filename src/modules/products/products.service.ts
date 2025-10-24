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
import { FlowsService } from '../flows/flows.service';
import { TasksService } from '../tasks/tasks.service';
import { EmployeesService } from '../employees/employees.service';
import { MaterialsService } from '../materials/materials.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        private readonly ordersService: OrdersService,
        private readonly categoriesService: CategoriesService,
        private readonly flowsService: FlowsService,
        private readonly tasksService: TasksService,
        private readonly employeesService: EmployeesService,
        private readonly materialsService: MaterialsService
    ) { }

    async findAll(): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.find();

        if (!products || products.length === 0) {
            throw new NotFoundException('No hay productos');
        }
        return products.map(product => plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true }))
    }

    async findById(id: number): Promise<ProductResponseDto> {
        const product = await this.productRepository.findOne({ where: { id_product: id }, relations: ['order', 'category', 'state'] });

        if (!product) {
            throw new NotFoundException('Producto no existe');
        }

        return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
    }

    async updateProduct(id: number, updatePoduct: UpdateProductDto): Promise<ProductResponseDto> {
        const existingProduct = await this.productRepository.preload({ id_product: id, ...updatePoduct });

        if (!existingProduct) {
            throw new NotFoundException('El producto no existe')
        }

        if (existingProduct.id_state != 1) {
            throw new BadRequestException('El producto ya se encuentra en producción, no puedes cambiarlo');
        }

        const savedProduct = this.productRepository.save(existingProduct);
        return plainToInstance(ProductResponseDto, savedProduct, { excludeExtraneousValues: true })

    }

    //PARA GESTION
    async createProduct(createProduct: CreateProductDto): Promise<ProductResponseDto> {
        // Validar orden y categoría
        await this.ordersService.findById(createProduct.id_order);
        const category = await this.categoriesService.findById(createProduct.id_category);

        // PASO 1: Validar materiales y stock (antes de crear nada)
        const materialsData = await this.materialsService.validateMaterial(
            createProduct.materials
        );

        // PASO 2: Crear el producto
        const { materials, ...productData } = createProduct;
        const newProduct = this.productRepository.create({ ...productData, id_state: 1 });
        const savedProduct = await this.productRepository.save(newProduct);

        // PASO 3: Obtener flows
        const flows = await this.flowsService.findByCategoryOrderBySequence(savedProduct.id_category);

        if (!flows || flows.length === 0) {
            // Revertir: eliminar producto creado
            await this.productRepository.remove(savedProduct);
            throw new BadRequestException(
                `No hay flujos configurados para la categoría ${category.name}`
            );
        }

        try {
            // PASO 4: Crear tareas, asignar empleados y distribuir materiales
            for (const flow of flows) {
                // 4.1 Crear tarea
                const task = await this.tasksService.createTask({
                    id_product: savedProduct.id_product,
                    id_area: flow.role.id_area,
                    sequence: flow.sequence,
                    id_state: 1
                });

                // 4.2 Asignar empleado con menor carga
                try {
                    const employee = await this.employeesService.findEmployeeWithLeastWorkload(flow.id_role);
                    await this.tasksService.assignEmployee(task.id_task, employee.id_employee);
                } catch (error) {
                    console.warn(`No se pudo asignar empleado a tarea ${task.id_task}: ${error.message}`);
                }

                // 4.3 Distribuir materiales que pertenecen a esta área
                const materialsForArea = materialsData.filter(m => m.id_area === flow.role.id_area);

                for (const materialData of materialsForArea) {
                    await this.materialsService.createMaterialConsumption({
                        id_material: materialData.id_material,
                        id_task: task.id_task,
                        quantity: materialData.quantity,
                    });
                }
            }

            // PASO 5: Retornar producto con relaciones
            return await this.findById(savedProduct.id_product);

        } catch (error) {
            // Si algo falla, eliminar el producto y sus tareas
            // (Las tareas se eliminan en cascada si configuraste ON DELETE CASCADE)
            await this.productRepository.remove(savedProduct);
            throw new BadRequestException(
                `Error al crear producto con flujo de trabajo: ${error.message}`
            );
        }
    }

    //PARA WEB!!!
    /*
    async createProduct(createProduct: CreateProductDto): Promise<ProductResponseDto> {
        await this.ordersService.findById(createProduct.id_order);

        const category = await this.categoriesService.findById(createProduct.id_category)

        const newProduct = this.productRepository.create({ ...createProduct, id_state: 1 });
        const savedProduct = await this.productRepository.save(newProduct);

        const flows = await this.flowsService.findByCategoryOrderBySequence(savedProduct.id_category);

        if (!flows || flows.length === 0) {
            throw new BadRequestException(
                `No hay flujos configurados para la categoría ${category.name}`
            );
        }

        for(const flow of flows){
            const task = await this.tasksService.createTask({
                id_product: savedProduct.id_product, 
                id_area: flow.role.id_area, sequence: 
                flow.sequence, 
                id_state: 1});

            const employee = await this.employeesService.findEmployeeWithLeastWorkload(flow.id_role);
            await this.tasksService.assignEmployee(task.id_task, employee.id_employee);

        }

        const productRelations = this.productRepository.findOne({where: {id_product: savedProduct.id_product}, relations: ['category', 'state', 'order']}) 
        return plainToInstance(ProductResponseDto, productRelations, { excludeExtraneousValues: true })

    }

    async updateProduct(id: number, updatePoduct: UpdateProductDto): Promise<ProductResponseDto> {
        const existingProduct = await this.productRepository.preload({ id_product: id, ...updatePoduct });

        if (!existingProduct) {
            throw new NotFoundException('El producto no existe')
        }

        if (existingProduct.id_state != 1) {
            throw new BadRequestException('El producto ya se encuentra en producción, no puedes cambiarlo');
        }

        const savedProduct = this.productRepository.save(existingProduct);
        return plainToInstance(ProductResponseDto, savedProduct, { excludeExtraneousValues: true })

    }*/

    async deleteProduct(id: number) {
        const existingProduct = await this.productRepository.findOneBy({ id_product: id });

        if (!existingProduct) {
            throw new NotFoundException('El producto no existe')
        }

        if (existingProduct.id_state != 1) {
            throw new BadRequestException('El producto ya se encuentra en producción, no puedes eliminarlo');
        }

        const deletedProduct = await this.productRepository.remove(existingProduct);
        return plainToInstance(ProductResponseDto, deletedProduct, { excludeExtraneousValues: true });
    }

}
