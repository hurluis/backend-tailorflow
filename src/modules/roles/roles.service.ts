import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RoleResponseDto } from './dto/role-response.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRoleResposeDto } from './dto/update-role-response.dto';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private roleRepository: Repository<Role>){}

    async findAll(): Promise<RoleResponseDto[]>{
        const roles = await this.roleRepository.find()

        if(!roles || roles.length === 0){
            throw new NotFoundException('No se encontraron roles');
        }

        return roles.map(role => plainToInstance(RoleResponseDto, role, {excludeExtraneousValues: true}))
    }

    async findById(id:number): Promise<RoleResponseDto>{
        const role = await this.roleRepository.findOneBy({id_role: id});

        if(!role){
            throw new NotFoundException('Rol no encontrado');
        }

        return plainToInstance(RoleResponseDto, role, {excludeExtraneousValues: true});
    }

    async createRole(createRole: CreateRoleDto): Promise<RoleResponseDto>{
        const existingRole = await this.roleRepository.findOneBy({name: createRole.name});

        if(existingRole){
            throw new BadRequestException('El rol ya existe en el sistema');
        }

        const newRole = this.roleRepository.create(createRole);
        const savedRole = this.roleRepository.save(newRole);
        return plainToInstance(RoleResponseDto, savedRole, {excludeExtraneousValues: true})
    }

    async updateRole(id: number, updateRole: UpdateRoleDto): Promise<UpdateRoleResposeDto>{
        const existingRole = await this.roleRepository.preload({id_role: id, ...updateRole})

        if(!existingRole){
            throw new NotFoundException('El rol no existe en el sistema');
        }
        
        const savedRole = await this.roleRepository.save(existingRole);
        return plainToInstance(UpdateRoleResposeDto, savedRole, {excludeExtraneousValues: true})
    }

    async deleteRole(id: number): Promise<RoleResponseDto>{
        const existingRole = await this.roleRepository.findOneBy({id_role: id});

        if(!existingRole){
            throw new NotFoundException('El rol no existe en el sistema');
        }

        await this.roleRepository.remove(existingRole);
        return plainToInstance(RoleResponseDto, existingRole)
    }

}
