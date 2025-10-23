import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskResponseDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';
import { ProductsService } from '../products/products.service';
import { AreasService } from '../areas/areas.service';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>
    ) { }

    async findAll(): Promise<TaskResponseDto[]> {
        const tasks = await this.taskRepository.find({ relations: ['product', 'employee', 'area', 'state'] });

        if (!tasks || tasks.length === 0) {
            throw new NotFoundException('No existen tareas')
        }

        return tasks.map(task => plainToInstance(TaskResponseDto, task, { excludeExtraneousValues: true }))
    }

    async findById(id: number): Promise<TaskResponseDto> {
        const task = this.taskRepository.findOne({ where: { id_task: id } });

        if (!task) {
            throw new NotFoundException('Tarea no encontrada');
        }
        return plainToInstance(TaskResponseDto, task, { excludeExtraneousValues: true })
    }

    async createTask(taskData: { id_product: number, id_area: number; sequence: number; id_state: number; }): Promise<Task> {
        
        const existingTask = await this.taskRepository.findOne({ where: { id_product: taskData.id_product, sequence: taskData.sequence } });
        if (existingTask) {
            throw new BadRequestException(
                `Ya existe una tarea con la secuencia ${taskData.sequence} para este producto`
            );
        }
        const task = this.taskRepository.create({...taskData});
        return await this.taskRepository.save(task)
    }
}
