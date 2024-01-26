import {HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../models/dto/create-user.dto";
import {UserDto} from "../models/dto/user.dto";
import {ILogger} from "../../../logger/models/app-logger";
import {AuthService} from "../services/auth.service";
import {MicroServiceError} from "../../../exceptions/micro-service-error/micro-service-error";
import {ApiAuthErrorEnums} from "../enums/api-auth-error.enums";
import {UserTransformer} from "../transformers/user.transformer";
import {LoginDto} from "../models/dto/login.dto";

@Injectable()
export class AuthProvider {

    private readonly TAG: string = `${this.constructor.name}`;

    constructor(private readonly appLogger: ILogger,
                private readonly authService: AuthService) {
        this.appLogger.log('Init', this.TAG);
    }

    async signUp(createUser: CreateUserDto): Promise<UserDto> {
        this.appLogger.log('Creating user in database', this.TAG);
        const hashedPassword = await this.authService.hashPassword(createUser.password);
        if (!hashedPassword) {
            this.appLogger.error(`Failed to hash password`, this.TAG);
            throw new MicroServiceError(ApiAuthErrorEnums.ERROR_HASHING, HttpStatus.BAD_GATEWAY);
        }
        const user = await this.authService.signUp(hashedPassword, createUser);
        if (!user) {
            this.appLogger.error(`Failed to create user`, this.TAG);
            throw new MicroServiceError(ApiAuthErrorEnums.FAILED_TO_CREATE_USER, HttpStatus.BAD_REQUEST);
        }
        this.appLogger.log(`User successfully created with id ${user.user_id}`, this.TAG);
        return UserTransformer.createdUserToInterface(user);
    }

    async login(loginData: LoginDto): Promise<UserDto> {    
        this.appLogger.log('logging in to the shop', this.TAG);
        const user = await this.authService.getLoggedUser(loginData.email);
        if (!user) {    
            this.appLogger.error(`Failed to login`, this.TAG);
            throw new MicroServiceError(ApiAuthErrorEnums.USER_NOT_EXIST, HttpStatus.UNAUTHORIZED);
        }
        const comparePassword = await this.authService.comparePassword(loginData.password, user.password)
        if (!comparePassword) {
            this.appLogger.error(`Failed to login`, this.TAG);
            throw new MicroServiceError(ApiAuthErrorEnums.FAILED_TO_LOGIN, HttpStatus.UNAUTHORIZED);
        }
        const accessToken = await this.authService.createToken(user);
        if (!accessToken) {
            this.appLogger.error(`Failed to login`, this.TAG);
            throw new MicroServiceError(ApiAuthErrorEnums.FAILED_TO_LOGIN, HttpStatus.UNAUTHORIZED);
        }
        return UserTransformer.createdUserToInterface(user, accessToken);
    }
}
