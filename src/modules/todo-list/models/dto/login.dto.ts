import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class LoginDto {
    @ApiProperty({description: 'user email'})
    @IsString()
    email: string;
    @ApiProperty({description: 'user password'})
    @IsString()
    password: string;
}
