import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskResponseDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';

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

    async findByIdRelations(idTask: number): Promise <Task>{
        const task = await this.taskRepository.findOne({where: {id_task: idTask}, relations: ['area', 'product']});

        if(!task){
            throw new NotFoundException(`Tarea con ID ${idTask} no encontrada`);
        }

        return task
    }

    async createTask(taskData: { id_product: number, id_area: number; sequence: number; id_state: number; }): Promise<Task> {

        const existingTask = await this.taskRepository.findOne({ where: { id_product: taskData.id_product, sequence: taskData.sequence } });
        if (existingTask) {
            throw new BadRequestException(
                `Ya existe una tarea con la secuencia ${taskData.sequence} para este producto`
            );
        }
        const task = this.taskRepository.create({ ...taskData });
        return await this.taskRepository.save(task)
    }

    async assignEmployee(idTask: number, idEmployee: number): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { id_task: idTask },
        });

        if (!task) {
            throw new NotFoundException(`Tarea con ID ${idTask} no encontrada`);
        }

        if (task.id_employee) {
            throw new BadRequestException('La tarea ya tiene un empleado asignado');
        }

        task.id_employee = idEmployee;
        return await this.taskRepository.save(task);
    }


}
