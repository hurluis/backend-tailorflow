import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { MaterialConsumption } from './entities/material-consumption.entity';
import { MaterialResponseDto } from './dto/material/material-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateMaterialDto } from './dto/material/create-material.dto';
import { AreasService } from '../areas/areas.service';
import { UpdateMaterialDto } from './dto/material/update-material.dto';
import { MaterialConsumptionResponseDto } from './dto/material-consumption/material-consumption-response.dto';
import { TasksService } from '../tasks/tasks.service';
import { CreateMaterialConsumptionDto } from './dto/material-consumption/create-material-consumption.dto';
import { ProductMaterialDto } from '../products/dto/create-product.dto';

@Injectable()
export class MaterialsService {
    constructor(
        @InjectRepository(Material) private materialRepository: Repository<Material>,
        @InjectRepository(MaterialConsumption) private materialConsumptionRepository: Repository<MaterialConsumption>,
        private readonly areasService: AreasService,
        private readonly tasksService: TasksService
    ) { }

    async findAllMaterials(): Promise<MaterialResponseDto[]> {
        const materials = await this.materialRepository.find({ relations: ['area'] })

        if (!materials || materials.length === 0) {
            throw new NotFoundException('No hay materiales');
        }

        return materials.map(mat => plainToInstance(MaterialResponseDto, mat, { excludeExtraneousValues: true }))
    }

    async findMaterialByArea(id_area: number): Promise<MaterialResponseDto[]> {
        await this.areasService.findById(id_area);

        const materials = await this.materialRepository.find({ where: { id_area: id_area }, relations: ['area'] })

        if (!materials) {
            throw new NotFoundException('No hay ningún material en el area ')
        }

        return materials.map(mat => plainToInstance(MaterialResponseDto, mat, { excludeExtraneousValues: true }))

    }

    async findMaterialById(id: number): Promise<MaterialResponseDto> {
        const material = await this.materialRepository.findOne({ where: { id_material: id } });

        if (!material) {
            throw new NotFoundException('Material no encontrado');
        }

        return plainToInstance(MaterialResponseDto, material, { excludeExtraneousValues: true })
    }

    async createMaterial(newMaterial: CreateMaterialDto): Promise<MaterialResponseDto> {

        await this.areasService.findById(newMaterial.id_area);

        const existingMaterial = await this.materialRepository.findOne({ where: { id_area: newMaterial.id_area, name: newMaterial.name } });
        if (existingMaterial) {
            throw new ConflictException('ya existe un material con ese nombre en esta area')
        }

        const createdMaterial = this.materialRepository.create(newMaterial);
        const savedMaterial = await this.materialRepository.save(createdMaterial);
        return plainToInstance(MaterialResponseDto, savedMaterial, { excludeExtraneousValues: true })

    }

    async updateMaterial(id: number, material: UpdateMaterialDto): Promise<MaterialResponseDto> {
        const updatedMaterial = await this.materialRepository.preload({ id_material: id, ...material });

        if (!updatedMaterial) {
            throw new NotFoundException('El material no existe');
        }

        const existingMaterial = await this.materialRepository.findOneBy({ name: material.name, id_material: Not(id) });

        if (existingMaterial) {
            throw new ConflictException('El material con ese nombre ya existe')
        }

        const savedMaterial = await this.materialRepository.save(updatedMaterial);
        return plainToInstance(MaterialResponseDto, savedMaterial, { excludeExtraneousValues: true });
    }

    async deleteMaterial(id: number): Promise<MaterialResponseDto> {
        const existingMaterial = await this.materialRepository.findOne({ where: { id_material: id } })

        if (!existingMaterial) {
            throw new NotFoundException('El material no existe');
        }

        if (existingMaterial.consumptions.length > 0) {
            throw new BadRequestException(`No se puede eliminar el material porque tiene ${existingMaterial.consumptions.length} consumo(s) asociado(s)`)
        }

        const deletedMaterial = await this.materialRepository.remove(existingMaterial);
        return plainToInstance(MaterialResponseDto, deletedMaterial, { excludeExtraneousValues: true });
    }

    async adjustStock(id: number, quantity: number, operation: 'add' | 'subtract'): Promise<MaterialResponseDto> {
        const material = await this.materialRepository.findOne({ where: { id_material: id } });

        if (!material) {
            throw new NotFoundException(`Material con id ${id} no encontrado`);
        }

        if (operation === 'add') {
            material.current_stock += quantity;
        } else {
            if (material.current_stock < quantity) {
                throw new BadRequestException(
                    `Stock insuficiente del material '${material.name}'. ` +
                    `Stock actual: ${material.current_stock}, Se requiere: ${quantity}`
                );
            }
            material.current_stock -= quantity;
        }

        const savedMaterial = await this.materialRepository.save(material);
        return plainToInstance(MaterialResponseDto, savedMaterial, { excludeExtraneousValues: true });
    }

    async finAllConsumptions(): Promise<MaterialConsumptionResponseDto[]> {
        const consumptions = await this.materialConsumptionRepository.find({ relations: ['material', 'material.area'] });

        if (!consumptions || consumptions.length === 0) {
            throw new NotFoundException('No existen consumos para el material');
        }

        return consumptions.map(cons => plainToInstance(MaterialConsumptionResponseDto, cons, { excludeExtraneousValues: true }));
    }

    async findConsumptionById(id: number): Promise<MaterialConsumptionResponseDto> {
        const consumption = await this.materialConsumptionRepository.findOne({ where: { id_consumption: id }, relations: ['material', 'material.area', 'task', 'task.area'] });

        if (!consumption) {
            throw new NotFoundException(`Consumo con ID ${id} no encontrado`);
        }

        return plainToInstance(MaterialConsumptionResponseDto, consumption, { excludeExtraneousValues: true });
    }

    async findConsumptionByMaterial(idMaterial: number): Promise<MaterialConsumptionResponseDto[]> {

        await this.findMaterialById(idMaterial);

        const consumptions = await this.materialConsumptionRepository.find({ where: { id_material: idMaterial }, relations: ['material'] });

        if (!consumptions || consumptions.length === 0) {
            throw new NotFoundException('No existen consumos para el material');
        }

        return consumptions.map(cons => plainToInstance(MaterialConsumptionResponseDto, cons, { excludeExtraneousValues: true }));
    }

    async findConsumptionsByTask(idTask: number): Promise<MaterialConsumptionResponseDto[]> {
        await this.tasksService.findById(idTask)
        const consumptions = await this.materialConsumptionRepository.find({ where: { id_task: idTask }, relations: ['material', 'material.area', 'task'] });

        if (!consumptions || consumptions.length === 0) {
            throw new NotFoundException('No existen consumos para esta tarea');
        }

        return consumptions.map(cons => plainToInstance(MaterialConsumptionResponseDto, cons, { excludeExtraneousValues: true }));
    }

    async createMaterialConsumption(newConsumption: CreateMaterialConsumptionDto): Promise<MaterialConsumptionResponseDto> {
        const task = await this.tasksService.findByIdRelations(newConsumption.id_task);

        const material = await this.materialRepository.findOne({ where: { id_material: newConsumption.id_material }, relations: ['area'] });

        if (!material) {
            throw new NotFoundException(`Material con id ${newConsumption.id_material} no encontrado`);
        }

        if (material.id_area != task.id_area) {
            throw new BadRequestException(
                `El material '${material.name}' pertenece al área '${material.area.name}' ` +
                `pero la tarea pertenece al área '${task.area.name}'. ` +
                `No se puede registrar el consumo.`
            );
        }

        if (material.current_stock < newConsumption.quantity) {
            throw new BadRequestException(
                `Stock insuficiente del material '${material.name}'. ` +
                `Stock actual: ${material.current_stock}, Se requiere: ${newConsumption.quantity}`
            );
        }

        const consumption = this.materialConsumptionRepository.create(newConsumption);
        const savedConsumption = await this.materialConsumptionRepository.save(consumption);

        await this.adjustStock(material.id_material, newConsumption.quantity, 'subtract');

        const consumptionWithRelations = await this.materialConsumptionRepository.findOne({ where: { id_consumption: savedConsumption.id_consumption }, relations: ['material', 'material.area', 'task'] });
        return plainToInstance(MaterialConsumptionResponseDto, consumptionWithRelations, { excludeExtraneousValues: true });
    }

    async validateMaterial(materialsConsumptionDto: ProductMaterialDto[]): Promise<any> {

        const materialPromises = materialsConsumptionDto.map(async (mat) => {
            const material = await this.materialRepository.findOne({
                where: { id_material: mat.id_material },
                relations: ['area']
            });

            if (!material) {
                throw new NotFoundException(`Material con ID ${mat.id_material} no encontrado`);
            }

            if (material.current_stock < mat.quantity) {
                throw new BadRequestException(
                    `Stock insuficiente del material '${material.name}'. ` +
                    `Stock actual: ${material.current_stock}, Se requiere: ${mat.quantity}`
                );
            }

            return {
                id_material: material.id_material,
                id_area: material.id_area,
                material_name: material.name,
                quantity: mat.quantity
            };
        });

        return await Promise.all(materialPromises);
    }

    async findConsumptionsByTaskId(taskId: number): Promise<MaterialConsumption[]> {
        return await this.materialConsumptionRepository.find({ where: { id_task: taskId } });
    }

    async returnMaterialStock(materialId: number, quantity: number): Promise<void> {
        const material = await this.materialRepository.findOne({ where: { id_material: materialId } });

        if (!material) {
            throw new NotFoundException(`Material ${materialId} no encontrado`);
        }

        material.current_stock += quantity;
        await this.materialRepository.save(material);
    }

    async deleteMaterialConsumptionsByTask(taskId: number): Promise<void> {
        await this.materialConsumptionRepository.delete({ id_task: taskId });
    }

    async checkStock(materials: { id_material: number; quantity: number }[]): Promise<{
        hasStock: boolean;
        message: string;
        insufficientMaterials?: { id_material: number; name: string; available: number; required: number }[];
    }> {
        const insufficientMaterials: {
            id_material: number;
            name: string;
            available: number;
            required: number
        }[] = [];

        for (const item of materials) {
            const material = await this.materialRepository.findOne({
                where: { id_material: item.id_material }
            });

            if (!material) {
                throw new NotFoundException(`Material con ID ${item.id_material} no encontrado`);
            }

            if (material.current_stock < item.quantity) {
                insufficientMaterials.push({
                    id_material: material.id_material,
                    name: material.name,
                    available: material.current_stock,
                    required: item.quantity
                });
            }
        }

        if (insufficientMaterials.length > 0) {
            const details = insufficientMaterials
                .map(m => `${m.name}: disponible ${m.available}, requerido ${m.required}`)
                .join('; ');

            return {
                hasStock: false,
                message: `Stock insuficiente para: ${details}`,
                insufficientMaterials
            };
        }

        return {
            hasStock: true,
            message: 'Stock suficiente para todos los materiales'
        };
    }

}
