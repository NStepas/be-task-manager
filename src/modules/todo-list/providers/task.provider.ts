import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";

import {ILogger} from "../../../logger/models/app-logger";
import {CreateTaskDto} from "../models/dto/create-task.dto";
import {TaskDto} from "../models/dto/task.dto";
import {TaskService} from "../services/task.service";
import {Task} from "../models/domain/task.entity";
import {TaskTransformer} from "../transformers/task.transformer";
import {DeleteTaskInterface} from "../models/interface/delete-task-interface";
import {UpdateTaskDto} from "../models/dto/update-task.dto";

@Injectable()
export class TaskProvider {

    private readonly TAG: string = `${this.constructor.name}`;

    constructor(private readonly appLogger: ILogger,
                private readonly taskService: TaskService,
                private readonly jwtService: JwtService) {
        this.appLogger.log('Init', this.TAG);
    }

    async createTask(createTask: CreateTaskDto, userId: string): Promise<TaskDto | Task> {
        this.appLogger.log('Creating task in database', this.TAG);
        return await this.taskService.createTask(createTask, userId);
    }

    async getUserTasks(accessToken: string, userId: string): Promise<TaskDto[] | Task[]> {
        this.appLogger.log(`Trying to get tasks for user with id: ${userId}`, this.TAG);
        const task = await this.taskService.getUserTasks(userId);
        return TaskTransformer.tasksToInterface(task);
    }

    async getUserImportantTasks(accessToken: string, userId: string): Promise<TaskDto[] | Task[]> {
        this.appLogger.log(`Trying to get important tasks for user with id: ${userId}`, this.TAG);
        const task = await this.taskService.getUserImportantTasks(userId);
        return TaskTransformer.tasksToInterface(task);
    }

    async getUserTodayTasks(accessToken: string, userId: string): Promise<TaskDto[] | Task[]> {
        this.appLogger.log(`Trying to get today tasks for user with id: ${userId}`, this.TAG);
        const task = await this.taskService.getUserTodayTasks(userId);
        return TaskTransformer.tasksToInterface(task);
    }

    async getUserTaskForASpecificDate(accessToken: string, userId: string, date: string): Promise<TaskDto[] | Task[]> {
        this.appLogger.log(`Trying to get user tasks for a specific date`, this.TAG);
        const task = await this.taskService.getUserTaskForASpecificDate(userId, date.split('-').reverse().join('.'));
        return TaskTransformer.tasksToInterface(task);
    }

    async deleteUserTask(accessToken: string, taskId: number): Promise<DeleteTaskInterface> {
        this.appLogger.log(`Decoding token`, this.TAG);
        const decodedToken = await this.jwtService.decode(accessToken.split(' ').slice(1).join()) as any;
        this.appLogger.log(`Trying to delete task with id: ${taskId}`, this.TAG);
        console.log(taskId)
        await this.taskService.deleteTask(taskId, decodedToken.id);
        return {isDeleted: true};
    }

    async updateTask(updateTask: UpdateTaskDto): Promise<TaskDto> {
        this.appLogger.log(`Trying to update task with id: ${updateTask.taskId}`, this.TAG);
        const updatedTask = await this.taskService.updateTask(updateTask, updateTask.taskId, updateTask.userId);
        this.appLogger.log(`Task with id: ${updatedTask.id} is successfully updated`, this.TAG);
        return TaskTransformer.updatedTaskToInterface(updatedTask) as any;
    }

    async getTaskById(userId: string, taskId: number): Promise<TaskDto | Task> {
        this.appLogger.log(`Trying to get tasks for user with id: ${userId}`, this.TAG);
        const task = await this.taskService.getUserTaskById(userId, taskId);
        return task;
    }
}
