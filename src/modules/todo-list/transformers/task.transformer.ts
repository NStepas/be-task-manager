import * as moment from 'moment-timezone';

import {CreateTaskDto} from "../models/dto/create-task.dto";
import {Task} from "../models/domain/task.entity";
import {UpdateTaskDto} from "../models/dto/update-task.dto";

moment.tz.setDefault('Ukraine/Kiev');

export class TaskTransformer {
    public static taskInterfaceToEntity(taskToCreate: CreateTaskDto, userId: string): Task {
        const task = new Task();
        task.user = userId;
        task.task_name = taskToCreate.taskName;
        task.is_important = taskToCreate.isImportant;
        if (taskToCreate.address) {
            task.address = taskToCreate.address;
        }
        if (taskToCreate.completeDate) {
            task.complete_date = taskToCreate.completeDate.split('-').reverse().join('.');
        }
        if(taskToCreate.description) {
            task.description = taskToCreate.description
        }
        task.created_at = moment().format('DD.MM.YYYY');
        return task;
    }

    public static updateTaskInterfaceToEntity(taskToUpdate: UpdateTaskDto, taskId: number, userId: string): Task {
        const task = new Task();
        task.id = taskId;
        task.user = userId;
        task.is_important = taskToUpdate.isImportant;
        if (taskToUpdate.taskName) {
            task.task_name = taskToUpdate.taskName;
        }
        if (taskToUpdate.description) {
            task.description = taskToUpdate.description;
        }
        if (taskToUpdate.address) {
            task.address = taskToUpdate.address;
        }
        if (taskToUpdate.completeDate) {
            task.complete_date = taskToUpdate.completeDate;
        }
        return task;
    }

    public static tasksToInterface(task: Task[]): Task[] {
        return task.map(res => {
            return {
                ...res,
                user: {
                    id: res.user.id,
                    email: res.user.email,
                    firstName: res.user.first_name,
                    lastName: res.user.last_name,
                    phone: res.user.phone,
                    address: res.user.address,
                }
            }
        }) as any
    }

    public static updatedTaskToInterface(task: Task): Task {
        return {
            ...task,
            user: {
                id: task.user.id,
                email: task.user.email,
                firstName: task.user.first_name,
                lastName: task.user.last_name,
                phone: task.user.phone,
                address: task.user.address,
            }
        } as any
    }

    public static getCurrentDate() {
        return moment().format('DD.MM.YYYY');
    }
}


