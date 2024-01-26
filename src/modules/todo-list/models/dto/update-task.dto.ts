import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';

export class UpdateTaskDto {
    @ApiProperty({description: 'user id'})
    @IsString()
    userId: string;
    @ApiProperty({description: 'task id'})
    @IsNumber()
    taskId: number;
    @ApiProperty({description: 'task name'})
    @IsString()
    taskName: string;
    @ApiProperty({description: 'task description'})
    @IsString()
    @MaxLength(30)
    description?: string;
    @ApiProperty({description: 'task address'})
    @IsString()
    address?: string;
    @ApiProperty({description: 'is task important'})
    @IsBoolean()
    isImportant: boolean;
    @ApiProperty({description: 'task complete dated'})
    @IsString()
    @IsOptional()
    completeDate?: string;
}
