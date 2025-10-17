import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { AreaResponseDto } from './dto/area-respose.dto';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  async findAll(): Promise<BaseApplicationResponseDto<AreaResponseDto[]>>{
    const areas = await this.areasService.findAll();
        return{
            statusCode: 200, 
            message: 'Areas obtenidos correctamente',
            data: areas
        }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<BaseApplicationResponseDto<AreaResponseDto>> {
    const area = await this.areasService.findById(+id);
        return{
            statusCode: 200, 
            message: 'Area obtenida correctamente',
            data: area
        }
  }

  @Post()
  async createArea(@Body() createArea: CreateAreaDto): Promise<BaseApplicationResponseDto<AreaResponseDto>> {
    const newArea = await this.areasService.createArea(createArea);
        return{
            statusCode: 201, 
            message: 'Area creada correctamente',
            data: newArea
        }
  }

  @Patch(':id')
  async updateArea(@Param('id') id: string, @Body() updateArea: CreateAreaDto): Promise<BaseApplicationResponseDto<AreaResponseDto>> {
    const updatedArea =  await this.areasService.updateArea(+id, updateArea);
    return{
            statusCode: 202, 
            message: 'Area actualizada correctamente',
            data: updatedArea
        }
  }

  @Delete(':id')
  async deleteArea(@Param('id') id: string): Promise<BaseApplicationResponseDto<AreaResponseDto>> {
    const deletedArea = await  this.areasService.deleteArea(+id);
    return{
            statusCode: 202, 
            message:'Area eliminada correctamente',
            data: deletedArea
        }
  }
}
