import {ApiProperty} from "@nestjs/swagger";

export class TaskDto {
    @ApiProperty({description: 'task id'})
    id: string;
    @ApiProperty({description: 'task name'})
    taskName: string;
    @ApiProperty({description: 'task description'})
    description: string;
    @ApiProperty({description: 'is task important password'})
    isImportant: boolean;
    @ApiProperty({description: 'task complete dated'})
    completeDate: string;
}
