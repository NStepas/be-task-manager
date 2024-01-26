import {ApiProperty} from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({description: 'user userId'})
    user_id: string;
    @ApiProperty({description: 'user email'})
    email: string;
    @ApiProperty({description: 'user password'})
    password: string;
    @ApiProperty({description: 'user first name'})
    firstName: string;
    @ApiProperty({description: 'user last name'})
    lastName: string;
    @ApiProperty({description: 'user phone'})
    phone: string;
    @ApiProperty({description: 'user address'})
    address: string;
}
