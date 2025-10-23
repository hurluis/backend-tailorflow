import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { Not, Repository } from 'typeorm';
import { MaterialConsumption } from './entities/material-consumption.entity';
import { MaterialResponseDto } from './dto/material/material-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateMaterialDto } from './dto/material/create-material.dto';
import { AreasService } from '../areas/areas.service';
import { UpdateMaterialDto } from './dto/material/update-material.dto';
import { MaterialConsumptionResponseDto } from './dto/material-consumption/material-consumption-response.dto';

@Injectable()
export class MaterialsService {
    constructor(
        @InjectRepository(Material) private materialRepository: Repository<Material>,
        @InjectRepository(MaterialConsumption) private materialConsumptionRepository: Repository<MaterialConsumption>,
        private readonly areasService: AreasService
    ){}

    async findAllMaterials(): Promise<MaterialResponseDto[]>{
        const materials = await this.materialRepository.find({relations: ['area']})

        if(!materials || materials.length=== 0){
            throw new NotFoundException('No hay materiales');
        }

        return materials.map(mat => plainToInstance(MaterialResponseDto, mat, {excludeExtraneousValues:true}))
    }

    async findMaterialByArea(id_area: number): Promise<MaterialResponseDto[]>{
        await this.areasService.findById(id_area);

        const materials = await this.materialRepository.find({where: {id_area: id_area}, relations: ['area']})

        if(!materials){
            throw new NotFoundException('No hay ningún material en el area ')
        }
        
        return materials.map(mat => plainToInstance(MaterialResponseDto, mat, {excludeExtraneousValues:true}))

    }

    async findMaterialById(id:number): Promise<MaterialResponseDto>{
        const material = await this.materialRepository.findOne({where: {id_material: id}});

        if(!material){
            throw new NotFoundException('Material no encontrado');
        }

        return plainToInstance(MaterialResponseDto, material, {excludeExtraneousValues:true})
    }

    async createMaterial(newMaterial: CreateMaterialDto): Promise<MaterialResponseDto>{
       
        await this.areasService.findById(newMaterial.id_area);
    
        const existingMaterial = await this.materialRepository.findOne({where: {id_area: newMaterial.id_area,name: newMaterial.name}});
        if(existingMaterial){
            throw new ConflictException('ya existe un material con ese nombre en esta area')
        }

        const createdMaterial = this.materialRepository.create(newMaterial);
        const savedMaterial = await this.materialRepository.save(createdMaterial);
        return plainToInstance(MaterialResponseDto, savedMaterial, {excludeExtraneousValues:true})


    }

    async updateMaterial(id: number, material: UpdateMaterialDto): Promise<MaterialResponseDto>{
        const updatedMaterial = await this.materialRepository.preload({id_material: id, ...material});
        
        if(!updatedMaterial){
            throw new NotFoundException('El material no existe');
        }

        const existingMaterial = await this.materialRepository.findOneBy({name: material.name, id_material: Not(id) });

        if(existingMaterial){
            throw new ConflictException('El material con ese nombre ya existe')
        }

        const savedMaterial = await this.materialRepository.save(updatedMaterial);
        return plainToInstance(MaterialResponseDto, savedMaterial, {excludeExtraneousValues: true});
    }

    async deleteMaterial(id:number): Promise<MaterialResponseDto>{
        const existingMaterial = await this.materialRepository.findOne({where: {id_material: id}})

        if(!existingMaterial){
            throw new NotFoundException('El material no existe');
        }

        if(existingMaterial.consumptions.length > 0){
            throw new BadRequestException(`No se puede eliminar el material porque tiene ${existingMaterial.consumptions.length} consumo(s) asociado(s)`)
        }

        const deletedMaterial = await this.materialRepository.remove(existingMaterial);
        return plainToInstance(MaterialResponseDto, deletedMaterial, {excludeExtraneousValues:true});
    }

    async finAllConsumptions(): Promise<MaterialConsumptionResponseDto[]>{
        const consumptions = await this.materialConsumptionRepository.find({relations: ['material', 'material.area']});

        if(!consumptions || consumptions.length === 0){
            throw new NotFoundException('No existen consumos para el material');
        }

        return consumptions.map(cons => plainToInstance(MaterialConsumptionResponseDto, cons, {excludeExtraneousValues:true}));
    }

    async findConsumptionByMaterial(idMaterial: number): Promise<MaterialConsumptionResponseDto[]>{
        
        await this.findMaterialById(idMaterial);

        const consumptions = await this.materialConsumptionRepository.find({where: {id_material: idMaterial}, relations: ['material']});

        if(!consumptions || consumptions.length === 0){
            throw new NotFoundException('No existen consumos para el material');
        }

        return consumptions.map(cons => plainToInstance(MaterialConsumptionResponseDto, cons, {excludeExtraneousValues:true}));
    }

    async findConsumptionsByTask(idTask: number): Promise<MaterialConsumptionResponseDto[]>{
        const consumptions = await this.materialConsumptionRepository.find({where: { id_task: idTask }, relations: ['material', 'material.area']});
        
        if(!consumptions || consumptions.length === 0){
            throw new NotFoundException('No existen consumos para esta tarea');
        }

        return consumptions.map(cons => plainToInstance(MaterialConsumptionResponseDto, cons, {excludeExtraneousValues:true}));
    }

    //create se hace cuando tengamos Task
    //Update se hace cuando tengamos Task
    //delete se hace cuando tengamos task


}
