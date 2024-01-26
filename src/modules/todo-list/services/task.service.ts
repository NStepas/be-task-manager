import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ILogger} from "../../../logger/models/app-logger";
import {Task} from "../models/domain/task.entity";
import {CreateTaskDto} from "../models/dto/create-task.dto";
import {TaskRepository} from "../repositories/task.repository";
import {TaskTransformer} from "../transformers/task.transformer";
import {MicroServiceError} from "../../../exceptions/micro-service-error/micro-service-error";
import {ApiTaskErrorEnums} from "../enums/api-task-error.enums";
import {DeleteResult} from "typeorm";
import {UpdateTaskDto} from "../models/dto/update-task.dto";


@Injectable()
export class TaskService {

    private readonly TAG: string = `${this.constructor.name}`;

    constructor(
        @InjectRepository(TaskRepository) private readonly taskRepository: TaskRepository,
        private readonly appLogger: ILogger) {
        this.appLogger.log('Init', this.TAG);
    }

    async createTask(createTask: CreateTaskDto, userId: string): Promise<Task> {
        try {
            const taskToCreate = TaskTransformer.taskInterfaceToEntity(createTask, userId);
            console.log(taskToCreate)
            this.appLogger.log('Task is successfully created', this.TAG);
            return await this.taskRepository.saveTask(taskToCreate);
        } catch (err) {
            this.appLogger.error(`Failed to create task`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_CREATE_TASK, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserTasks(userId: string): Promise<Task[]> {
        try {
            return await this.taskRepository.getUserTasks(userId)
        } catch (err) {
            this.appLogger.error(`Failed to get tasks for user with id: ${userId} task`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_GET_TASKS, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserImportantTasks(userId: string): Promise<Task[]> {
        try {
            return await this.taskRepository.getUserImportantTasks(userId, true)
        } catch (err) {
            this.appLogger.error(`Failed to get important tasks for user with id: ${userId} task`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_GET_IMPORTANT_TASKS, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserTodayTasks(userId: string): Promise<Task[]> {
        try {
            const currentDate = TaskTransformer.getCurrentDate();
            return await this.taskRepository.getUserTodayTasks(userId, currentDate)
        } catch (err) {
            this.appLogger.error(`Failed to get today tasks for user with id: ${userId} task`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_GET_TODAY_TASKS, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserTaskForASpecificDate(userId: string, date: string): Promise<Task[]> {
        try {
            return await this.taskRepository.getUserTaskForASpecificDate(userId, date)
        } catch (err) {
            this.appLogger.error(`Failed to get user tasks for a specific date`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_GET_USER_TASKS, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserTaskById(userId: string, taskId: number): Promise<Task> {
        try {
            return await this.taskRepository.getTaskById(userId, taskId)
        } catch (err) {
            this.appLogger.error(`Failed to get user tasks for a specific date`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_GET_TASK_BY_ID, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteTask(taskId: number, userId: string): Promise<DeleteResult> {
        try {
            const isDeleted = await this.taskRepository.deleteTask(taskId, userId);
            if (isDeleted.affected === 0) {
                return null;
            }
            return isDeleted;
        } catch (err) {
            this.appLogger.error(`Failed to delete task with id: ${taskId}`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_DELETE_TASK, HttpStatus.BAD_REQUEST);
        }
    }

    async updateTask(updateTask: UpdateTaskDto, taskId: number, userId: string): Promise<Task> {
        try {
            const updatedTaskToEntity = TaskTransformer.updateTaskInterfaceToEntity(updateTask, taskId, userId);
            return await this.taskRepository.updateTask(updatedTaskToEntity);
        } catch (err) {
            this.appLogger.error(`Failed to update task with id: ${taskId}`, this.TAG);
            throw new MicroServiceError(ApiTaskErrorEnums.FAILED_TO_UPDATE_TASK, HttpStatus.BAD_REQUEST);
        }
    }

}
