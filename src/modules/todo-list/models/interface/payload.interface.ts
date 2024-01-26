import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class PayloadInterface {
    @ApiProperty({description: 'shop id'})
    @IsString()
    user_id: string;
    @ApiProperty({description: 'shop email'})
    @IsString()
    email: string;
}
