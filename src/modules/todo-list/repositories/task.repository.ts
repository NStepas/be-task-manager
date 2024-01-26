import {DeleteResult, EntityRepository, Repository} from 'typeorm';
import {Task} from "../models/domain/task.entity";


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    protected TAG: string = `TaskRepository`;

    async saveTask(task: Task): Promise<Task> {
        return this.save(task);
    }

    async getUserTasks(userId: string): Promise<Task[]> {
        return await this.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.user = :userId', {userId})
            .getMany()
    }

    async getUserTaskById(userId: string, taskId: number): Promise<Task> {
        return await this.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.user = :userId', {userId})
            .andWhere('task.id = :taskId', {taskId})
            .getOne()
    }

    async getTaskById(userId: string, taskId: number): Promise<Task> {
        return await this.createQueryBuilder('task')
            .where('task.user = :userId', {userId})
            .andWhere('task.id = :taskId', {taskId})
            .getOne()
    }

    async getUserImportantTasks(userId: string, important: boolean): Promise<Task[]> {
        return await this.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.user = :userId', {userId})
            .andWhere('task.is_important = :important', {important})
            .getMany()
    }

    async getUserTodayTasks(userId: string, currentDate: string): Promise<Task[]> {
        return await this.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.user = :userId', {userId})
            .andWhere('task.created_at = :currentDate', {currentDate})
            .getMany()
    }

    async getUserTaskForASpecificDate(userId: string, date: string): Promise<Task[]> {
        return await this.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.user = :userId', {userId})
            .andWhere('task.created_at = :date', {date})
            .getMany()
    }

    async deleteTask(taskId: number, userId: string): Promise<DeleteResult> {
        return await this.createQueryBuilder()
            .delete()
            .where('id = :taskId', {taskId})
            .andWhere('user = :userId', {userId})
            .execute()
    }

    async updateTask(updatedTaskToEntity: Task): Promise<Task> {
        const savedTask = await this.save(updatedTaskToEntity);
        return await this.getUserTaskById(savedTask.user, savedTask.id)
    }

}
