import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRoleResposeDto } from './dto/update-role-response.dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService){}

    @Get()
    async findAll(): Promise<BaseApplicationResponseDto<RoleResponseDto[]>>{
        const roles = await this.rolesService.findAll()
        return{
            statusCode: 200, 
            message: 'Roles obtenidos correctamente',
            data: roles
        }
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<BaseApplicationResponseDto<RoleResponseDto>>{
        const role = await this.rolesService.findById(+id);
        return{
            statusCode: 200, 
            message: 'Rol obtenido correctamente',
            data: role
        }
    }

    @Post()
    async createRole(@Body() createRole: CreateRoleDto):Promise<BaseApplicationResponseDto<RoleResponseDto>>{
        const newRole = await this.rolesService.createRole(createRole);
        return{
            statusCode: 201, 
            message: 'Rol creado correctamente',
            data: newRole
        }

    }

    @Patch(':id')
    async updateRole(@Param('id') id: string, @Body() updateRole: UpdateRoleDto): Promise<BaseApplicationResponseDto<UpdateRoleResposeDto>>{
        const updatedRole = await this.rolesService.updateRole(+id, updateRole);
        return{
            statusCode: 202, 
            message: 'Rol actualizado correctamente',
            data: updatedRole
        }
    }

    @Delete(':id')
    async deleteRole(@Param('id') id:string): Promise<BaseApplicationResponseDto<RoleResponseDto>>{
        const deletedRole = await this.rolesService.deleteRole(+id);
        return{
            statusCode: 202, 
            message:'Rol eliminado correctamente',
            data: deletedRole
        }
    }
}
