import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import { TaskResponseDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task) private taskRepository: Repository<Task>,
        private dataSource: DataSource
    ) { }

    async findAll(): Promise<TaskResponseDto[]> {
        const tasks = await this.taskRepository.find({ relations: ['product', 'employee', 'area', 'state'] });

        if (!tasks || tasks.length === 0) {
            throw new NotFoundException('No existen tareas')
        }

        return tasks.map(task => plainToInstance(TaskResponseDto, task, { excludeExtraneousValues: true }))
    }

    async findById(id: number): Promise<TaskResponseDto> {
        const task = await this.taskRepository.findOne({ where: { id_task: id } });

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

    private async updateCascadingStates(idTask: number): Promise<void> {
        const task = await this.taskRepository.findOne({
            where: { id_task: idTask },
            relations: ['product', 'product.order']
        });

        if (!task) return;

        const productId = task.id_product;
        const orderId = task.product.id_order;

        await this.updateProductState(productId);
        await this.updateOrderState(orderId);
    }

    private async updateProductState(productId: number): Promise<void> {

        const tasks = await this.taskRepository.find({
            where: { id_product: productId }
        });

        if (!tasks || tasks.length === 0) return;

        const allPending = tasks.every(t => t.id_state === 1);
        const allFinished = tasks.every(t => t.id_state === 3);
        const someInProgress = tasks.some(t => t.id_state === 2);

        let newState: number;

        if (allFinished) {
            newState = 3;
        } else if (someInProgress || tasks.some(t => t.id_state === 3)) {
            newState = 2;
        } else {
            newState = 1;
        }


        await this.dataSource.query(
            'UPDATE PRODUCTS SET ID_STATE = :state WHERE ID_PRODUCT = :productId',
            [newState, productId]
        );
    }


    private async updateOrderState(orderId: number): Promise<void> {

        const products = await this.dataSource.query(
            'SELECT ID_STATE FROM PRODUCTS WHERE ID_ORDER = :orderId',
            [orderId]
        );

        if (!products || products.length === 0) return;

        const allPending = products.every(p => p.ID_STATE === 1);
        const allFinished = products.every(p => p.ID_STATE === 3);
        const someInProgress = products.some(p => p.ID_STATE === 2);

        let newState: number;

        if (allFinished) {
            newState = 3;
        } else if (someInProgress || products.some(p => p.ID_STATE === 3)) {
            newState = 2;
        } else {
            newState = 1;
        }


        await this.dataSource.query(
            'UPDATE ORDERS SET ID_STATE = :state WHERE ID_ORDER = :orderId',
            [newState, orderId]
        );
    }


    async startTask(idTask: number, employeeId: number): Promise<TaskResponseDto> {
        const task = await this.taskRepository.findOne({
            where: { id_task: idTask },
            relations: ['product', 'product.order']
        });

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
            throw new BadRequestException(
                'No se puede iniciar. La tarea anterior aún no ha sido completada.'
            );
        }


        task.id_state = 2;
        task.start_date = new Date();
        const savedTask = await this.taskRepository.save(task);


        await this.updateCascadingStates(idTask);
        return plainToInstance(TaskResponseDto, savedTask, { excludeExtraneousValues: true });
    }

    async completeTask(idTask: number, employeeId: number): Promise<TaskResponseDto> {
        const task = await this.taskRepository.findOne({
            where: { id_task: idTask },
            relations: ['product', 'product.order']
        });

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


        await this.updateCascadingStates(idTask);
        return plainToInstance(TaskResponseDto, savedTask, { excludeExtraneousValues: true });
    }

    private async findPreviousTask(id_product: number, sequence: number): Promise<Task | null> {
        if (sequence === 1) {
            return null;
        }
        return this.taskRepository.findOne({
            where: { id_product, sequence: sequence - 1 }
        });
    }

    async findByProductId(productId: number): Promise<Task[]> {
        return await this.taskRepository.find({where: { id_product: productId },relations: ['state']});
    }

    async deleteByProductId(productId: number): Promise<void> {
        await this.taskRepository.delete({ id_product: productId });
    }

}
