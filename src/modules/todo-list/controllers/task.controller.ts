import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Injectable,
    Post,
    UseGuards,
    Headers, Get, Param, Delete, Put,
} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ILogger} from "../../../logger/models/app-logger";
import {MicroServiceError} from "../../../exceptions/micro-service-error/micro-service-error";
import {TaskProvider} from "../providers/task.provider";
import {TaskDto} from "../models/dto/task.dto";
import {ApiTaskErrorEnums} from "../enums/api-task-error.enums";
import {CreateTaskDto} from "../models/dto/create-task.dto";
import {JwtAuthGuard} from "../../../guards/auth/jwt.guard";
import {Task} from "../models/domain/task.entity";
import {PARAMS} from "../../../shared/consts/path-params.const";
import {DeleteTaskInterface} from "../models/interface/delete-task-interface";
import {UpdateTaskDto} from "../models/dto/update-task.dto";


@Injectable()
@Controller('task')
export class TaskController {
    private readonly TAG: string = `${this.constructor.name}`;

    constructor(
        private readonly appLogger: ILogger,
        private readonly taskProvider: TaskProvider
    ) {
        this.appLogger.log('Init', this.TAG);
    }

    @Post(`create-task/:${PARAMS.USER_ID}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Create task'})
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Task created',
        type: TaskDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_CREATE_TASK,
        type: MicroServiceError,
    })
    async createTask(@Body() createTask: CreateTaskDto,
                     @Headers() header,
                     @Param(PARAMS.USER_ID) userId: string): Promise<TaskDto | Task> {
                         
        return await this.taskProvider.createTask(createTask, userId);
    }

    @Get(`user-tasks/:${PARAMS.USER_ID}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Get task'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tasks are gotten',
        type: [TaskDto],
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_GET_TASKS,
        type: MicroServiceError,
    })
    async getUserTasks(@Headers() header,
                       @Param(PARAMS.USER_ID) userId: string,): Promise<TaskDto[] | Task[]> {
        return await this.taskProvider.getUserTasks(header.authorization, userId);
    }

    @Get(`user-important-tasks/:${PARAMS.USER_ID}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Get important task'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Important tasks are gotten',
        type: [TaskDto],
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_GET_IMPORTANT_TASKS,
        type: MicroServiceError,
    })
    async getUserImportantTasks(@Headers() header,
                                @Param(PARAMS.USER_ID) userId: string,): Promise<TaskDto[] | Task[]> {
        return await this.taskProvider.getUserImportantTasks(header.authorization, userId);
    }

    @Get(`user-today-tasks/:${PARAMS.USER_ID}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Get today task'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Today tasks are gotten',
        type: [TaskDto],
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_GET_TODAY_TASKS,
        type: MicroServiceError,
    })
    async getUserTodayTasks(@Headers() header,
                            @Param(PARAMS.USER_ID) userId: string,): Promise<TaskDto[] | Task[]> {
        return await this.taskProvider.getUserTodayTasks(header.authorization, userId);
    }

    @Get(`user-tasks-for-a-specific-date/:${PARAMS.USER_ID}/:${PARAMS.DATE}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Get tasks for a specific date'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Spacific date tasks are gotten',
        type: [TaskDto],
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_GET_USER_TASKS,
        type: MicroServiceError,
    })
    async getUserTaskForASpecificDate(@Headers() header,
                                      @Param(PARAMS.USER_ID) userId: string,
                                      @Param(PARAMS.DATE) date: string): Promise<TaskDto[] | Task[]> {
        return await this.taskProvider.getUserTaskForASpecificDate(header.authorization, userId, date);
    }

    @Delete(`delete-task/:${PARAMS.TASK_ID}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Delete task'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Task is deleted',
        type: TaskDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_DELETE_TASK,
        type: MicroServiceError,
    })
    async deleteUserTask(@Headers() header,
                         @Param(PARAMS.TASK_ID) taskId: string,): Promise<DeleteTaskInterface> {
        return await this.taskProvider.deleteUserTask(header.authorization, Number(taskId));
    }

    @Put(`update-task/:${PARAMS.USER_ID}/:${PARAMS.TASK_ID}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Update task'})
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Task updated',
        type: TaskDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_UPDATE_TASK,
        type: MicroServiceError,
    })
    async updateTask(@Body() updateTask: UpdateTaskDto,
                     @Headers() header ): Promise<TaskDto> {
                         console.log(updateTask);
                         
        return await this.taskProvider.updateTask(updateTask);
    }

    @Get(`get-task/:${PARAMS.USER_ID}/:${PARAMS.TASK_ID}`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'Get task by id'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Spacific task are gotten',
        type: TaskDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiTaskErrorEnums.FAILED_TO_GET_TASK_BY_ID,
        type: MicroServiceError,
    })
    async getTaskById(@Headers() header,
                                      @Param(PARAMS.USER_ID) userId: string,
                                      @Param(PARAMS.TASK_ID) taskId: string): Promise<TaskDto | Task> {
        return await this.taskProvider.getTaskById(userId, Number(taskId));
    }    
}
