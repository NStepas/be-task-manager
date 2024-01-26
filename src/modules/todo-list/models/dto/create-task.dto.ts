import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional, IsString, MaxLength} from 'class-validator';

export class CreateTaskDto {
    @ApiProperty({description: 'task name'})
    @IsString()
    taskName: string;
    @ApiProperty({description: 'task description'})
    @IsString()
    @IsOptional()
    @MaxLength(30)
    description: string;
    @ApiProperty({description: 'task address'})
    @IsString()
    @IsOptional()
    @MaxLength(50)
    address?: string;
    @ApiProperty({description: 'is task important password'})
    @IsBoolean()
    isImportant: boolean;
    @ApiProperty({description: 'task complete dated'})
    @IsString()
    @IsOptional()
    completeDate?: string;
    @ApiProperty({description: 'task complete dated'})
    @IsString()
    @IsOptional()
    date?: string;
    @ApiProperty({description: 'task complete dated'})
    @IsString()
    @IsOptional()
    created_at?: string;
}
