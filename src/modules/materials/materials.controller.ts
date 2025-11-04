import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { MaterialResponseDto } from './dto/material/material-response.dto';
import { CreateMaterialDto } from './dto/material/create-material.dto';
import { UpdateMaterialDto } from './dto/material/update-material.dto';
import { MaterialConsumptionResponseDto } from './dto/material-consumption/material-consumption-response.dto';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { CheckStockDto } from './dto/material/check-stock.dto';

@Controller('materials')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class MaterialsController {
	constructor(private readonly materialsService: MaterialsService) { }

	@Post('check-stock')
	async checkStock(@Body() checkStockDto: CheckStockDto): Promise<BaseApplicationResponseDto<any>> {
		const result = await this.materialsService.checkStock(checkStockDto.materials);
		return {
			statusCode: 200,
			message: result.message,
			data: result,
		};
	}
	@Get()
	async findAll(): Promise<BaseApplicationResponseDto<MaterialResponseDto[]>> {
		const materials = await this.materialsService.findAllMaterials();
		return {
			statusCode: 200,
			message: 'Materiales obtenidos correctamente',
			data: materials,
		};
	}

	@Get(':id')
	async findByArea(@Param('id') id: string): Promise<BaseApplicationResponseDto<MaterialResponseDto[]>> {
		const materials = await this.materialsService.findMaterialByArea(+id);
		return {
			statusCode: 200,
			message: 'Materiales obtenidos correctamente',
			data: materials,
		};
	}

	@Get(':id')
	async findById(@Param('id') id: string): Promise<BaseApplicationResponseDto<MaterialResponseDto>> {
		const material = await this.materialsService.findMaterialById(+id);
		return {
			statusCode: 200,
			message: 'Material obtenido correctamente',
			data: material,
		};
	}

	@Post()
	async createMaterial(@Body() createMaterialDto: CreateMaterialDto): Promise<BaseApplicationResponseDto<MaterialResponseDto>> {
		const created = await this.materialsService.createMaterial(createMaterialDto);
		return {
			statusCode: 201,
			message: 'Material creado correctamente',
			data: created,
		};
	}

	@Patch(':id')
	async updateMaterial(@Param('id') id: string, @Body() updateMaterial: UpdateMaterialDto): Promise<BaseApplicationResponseDto<MaterialResponseDto>> {
		const updated = await this.materialsService.updateMaterial(+id, updateMaterial);
		return {
			statusCode: 202,
			message: 'Material actualizado correctamente',
			data: updated,
		};
	}

	@Delete(':id')
	async deleteMaterial(@Param('id') id: string): Promise<BaseApplicationResponseDto<MaterialResponseDto>> {
		const deleted = await this.materialsService.deleteMaterial(+id);
		return {
			statusCode: 202,
			message: 'Material eliminado correctamente',
			data: deleted,
		};
	}

	@Get('consumptions')
	async findAllConsumptions(): Promise<BaseApplicationResponseDto<MaterialConsumptionResponseDto[]>> {
		const consumptions = await this.materialsService.finAllConsumptions();
		return {
			statusCode: 200,
			message: 'Consumos obtenidos correctamente',
			data: consumptions,
		};
	}

	@Get(':id/consumptions')
	async findConsumptionsByMaterial(@Param('id') id: string): Promise<BaseApplicationResponseDto<MaterialConsumptionResponseDto[]>> {
		const consumptions = await this.materialsService.findConsumptionByMaterial(+id);
		return {
			statusCode: 200,
			message: 'Consumos del material obtenidos correctamente',
			data: consumptions,
		};
	}

	@Get('consumptions/task/:id')
	async findConsumptionsByTask(@Param('id') id: string): Promise<BaseApplicationResponseDto<MaterialConsumptionResponseDto[]>> {
		const consumptions = await this.materialsService.findConsumptionsByTask(+id);
		return {
			statusCode: 200,
			message: 'Consumos por tarea obtenidos correctamente',
			data: consumptions,
		};
	}
}
