import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({description: 'user email'})
    @IsString()
    email: string;
    @ApiProperty({description: 'user password'})
    @IsString()
    @MinLength(6)
    password: string;
    @ApiProperty({description: 'user first name'})
    @IsString()
    @MaxLength(10)
    firstName: string;
    @ApiProperty({description: 'user last name'})
    @IsString()
    @MaxLength(10)
    lastName: string;
    @ApiProperty({description: 'user phone'})
    @IsString()
    @MinLength(8)
    phone: string;
    @ApiProperty({description: 'user position'})
    @IsString()
    @IsOptional()
    position?: string;
    @ApiProperty({description: 'user address'})
    @IsString()
    @IsOptional()
    address?: string;
}
