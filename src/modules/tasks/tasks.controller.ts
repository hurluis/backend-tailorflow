import { Controller, Get, Param, Post, Patch, UseGuards, Body, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user/get-user.decorator';
import { TasksService } from './tasks.service';
import { Employee } from '../employees/entities/employee.entity';
import { BaseApplicationResponseDto } from 'src/common/dto/base-application-response.dto';
import { TaskResponseDto } from './dto/task-response.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {

    constructor(private readonly tasksService: TasksService) { }

    //Para admin
    @Get()
    async findAll(): Promise<BaseApplicationResponseDto<TaskResponseDto[]>> {
        const tasks = await this.tasksService.findAll();
        return {
            statusCode: HttpStatus.OK,
            message: 'Tareas obtenidas correctamente',
            data: tasks
        };
    }

     @Get('assigned') 
     async getAssignedTasks(@GetUser() user: Employee): Promise<BaseApplicationResponseDto<TaskResponseDto[]>> {
         const tasks = await this.tasksService.findAssignedTasks(user.id_employee);
         return {
             statusCode: HttpStatus.OK,
             message: 'Tareas asignadas obtenidas correctamente',
             data: tasks
         };
     }

   

    @Get(':id')
    async findById(@Param('id') id: string): Promise<BaseApplicationResponseDto<TaskResponseDto>> {
        const task = await this.tasksService.findById(+id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Tarea obtenida correctamente',
            data: task
        };
    }

    @Patch(':id/start')
    @HttpCode(HttpStatus.ACCEPTED)
    async startTask(@Param('id') idTask: string, @GetUser() user: Employee): Promise<BaseApplicationResponseDto<TaskResponseDto>> {
        const updatedTask = await this.tasksService.startTask(+idTask, user.id_employee);
        return {
            statusCode: HttpStatus.ACCEPTED,
            message: 'Tarea marcada como "En Proceso" y fecha de inicio registrada',
            data: updatedTask
        };
    }

    @Patch(':id/complete')
    @HttpCode(HttpStatus.ACCEPTED)
    async completeTask(@Param('id') idTask: string, @GetUser() user: Employee): Promise<BaseApplicationResponseDto<TaskResponseDto>> {
        const updatedTask = await this.tasksService.completeTask(+idTask, user.id_employee);
        return {
            statusCode: HttpStatus.ACCEPTED,
            message: 'Tarea completada exitosamente y fecha de fin registrada',
            data: updatedTask
        };
    }

}