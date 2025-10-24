import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

    async findByIdRelations(idTask: number): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id_task: idTask }, relations: ['area', 'product'] });

        if (!task) {
            throw new NotFoundException(`Tarea con ID ${idTask} no encontrada`);
        }

        return task
    }

    //Interno
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

    //Interno
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

    private async findPreviousTask(id_product: number, sequence: number): Promise<Task | null> {
        if (sequence === 1) {
            return null;
        }
        return this.taskRepository.findOne({
            where: { id_product, sequence: sequence - 1 }
        });
    }

    async startTask(idTask: number, employeeId: number): Promise<TaskResponseDto> {
        const task = await this.taskRepository.findOne({ where: { id_task: idTask } });

        if (!task) {
            throw new NotFoundException(`Tarea con ID ${idTask} no encontrada`);
        }

        if (task.id_employee !== employeeId) {
            throw new ForbiddenException('Solo el empleado asignado puede iniciar esta tarea.');
        }

        if (task.id_state !== 1) {
            if (task.id_state === 2) {
                throw new ConflictException('La tarea ya se encuentra en proceso.');
            }
            throw new BadRequestException('La tarea no se puede iniciar en su estado actual.');
        }


        const previousTask = await this.findPreviousTask(task.id_product, task.sequence);

        if (previousTask && previousTask.id_state !== 3) {
            throw new BadRequestException('No se puede iniciar. La tarea anterior aún no ha sido completada.');
        }


        task.id_state = 2;
        task.start_date = new Date();
        const savedTask = await this.taskRepository.save(task);

        return plainToInstance(TaskResponseDto, savedTask, { excludeExtraneousValues: true });
    }

    async completeTask(idTask: number, employeeId: number): Promise<TaskResponseDto> {
        const task = await this.taskRepository.findOne({ where: { id_task: idTask } });

        if (!task) {
            throw new NotFoundException(`Tarea con ID ${idTask} no encontrada`);
        }

        if (task.id_employee !== employeeId) {
            throw new ForbiddenException('Solo el empleado asignado puede completar esta tarea.');
        }

        if (task.id_state !== 2) {
            if (task.id_state === 3) {
                throw new ConflictException('La tarea ya se encuentra completada.');
            }
            throw new BadRequestException('La tarea solo se puede completar si está en proceso.');
        }


        task.id_state = 3;
        task.end_date = new Date();
        const savedTask = await this.taskRepository.save(task);

        return plainToInstance(TaskResponseDto, savedTask, { excludeExtraneousValues: true });
    }

    async findAssignedTasks(employeeId: number): Promise<TaskResponseDto[]> {
        const tasks = await this.taskRepository.find({
            where: { id_employee: employeeId },
            relations: ['product']
        });

        if (!tasks || tasks.length === 0) {
            throw new NotFoundException('No tienes tareas asignadas');
        }
        return tasks.map(task => plainToInstance(TaskResponseDto, task, { excludeExtraneousValues: true }));
    }

}
