import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Injectable,
    Post,
    UseGuards,
    Headers,
} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ILogger} from "../../../logger/models/app-logger";
import {MicroServiceError} from "../../../exceptions/micro-service-error/micro-service-error";
import {ApiAuthErrorEnums} from "../enums/api-auth-error.enums";
import {UserDto} from "../models/dto/user.dto";
import {CreateUserDto} from "../models/dto/create-user.dto";
import {AuthProvider} from "../providers/auth.provider";
import {LoginDto} from "../models/dto/login.dto";


@Injectable()
@Controller('auth')
export class AuthenticationController {
    private readonly TAG: string = `${this.constructor.name}`;

    constructor(
        private readonly appLogger: ILogger,
        private readonly authProvider: AuthProvider
    ) {
        this.appLogger.log('Init', this.TAG);
    }

    @Post('signUp')
    @ApiOperation({description: 'Create user'})
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User created',
        type: UserDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiAuthErrorEnums.FAILED_TO_SIGNUP,
        type: MicroServiceError,
    })
    async signUp(@Body() createUser: CreateUserDto): Promise<UserDto> {
        return await this.authProvider.signUp(createUser);
    }

    @Post('login')
    @ApiOperation({description: 'login'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User login in',
        type: UserDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiAuthErrorEnums.FAILED_TO_LOGIN,
        type: MicroServiceError,
    })
    async login(@Body() login: LoginDto): Promise<UserDto> {
        return await this.authProvider.login(login);
    }
}
