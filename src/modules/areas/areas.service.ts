import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { plainToInstance } from 'class-transformer';
import { AreaResponseDto } from './dto/area-respose.dto';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area) private areaRepository: Repository<Area>,
  ) {}

  async findAll(): Promise<AreaResponseDto[]> {
    const areas = await this.areaRepository.find({ relations: ['roles'] });

    if(!areas || areas.length === 0) {
      throw new NotFoundException('Aún no hay áreas en el sistema');
    }

    return areas.map(area => plainToInstance(AreaResponseDto, area, { excludeExtraneousValues: true }));
  }

  async findById(id: number): Promise<AreaResponseDto> {

    const area = await this.areaRepository.findOne({where: { id_area: id }, relations: ['roles'],});

    if(!area){
        throw new NotFoundException('Área no encontrada');
    } 

    return plainToInstance(AreaResponseDto, area, { excludeExtraneousValues: true });
  }

  async createArea(createDto: CreateAreaDto): Promise<AreaResponseDto> {
    const exists = await this.areaRepository.findOneBy({ name: createDto.name });

    if(exists){
        throw new BadRequestException('Ya existe un área con ese nombre');
    } 

    const newArea = this.areaRepository.create(createDto);
    const saved = await this.areaRepository.save(newArea);
    return plainToInstance(AreaResponseDto, saved, { excludeExtraneousValues: true });
  }

  async updateArea(id: number, updateDto: CreateAreaDto): Promise<AreaResponseDto> {

    const area = await this.areaRepository.preload({ id_area: id, ...updateDto });

    if(!area){
        throw new NotFoundException('Área no encontrada');
    } 
    const newAreaName = await this.areaRepository.findOneBy({ name: updateDto.name });

    if(newAreaName) {
      throw new BadRequestException('Ya existe un área con ese nombre');
    }

    const saved = await this.areaRepository.save(area);
    return plainToInstance(AreaResponseDto, saved, { excludeExtraneousValues: true });
  }

  async deleteArea(id: number): Promise<AreaResponseDto> {
    const area = await this.areaRepository.findOne({ where: { id_area: id }, relations: ['roles'] });

    if (!area){
        throw new NotFoundException('Área no encontrada');
    } 

    await this.areaRepository.remove(area);
    return plainToInstance(AreaResponseDto, area, { excludeExtraneousValues: true });
  }
}
