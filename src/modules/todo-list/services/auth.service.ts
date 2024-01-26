import {HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import {InjectRepository} from "@nestjs/typeorm";
import {JwtService} from '@nestjs/jwt';
import {UserRepository} from "../repositories/user.repository";
import {ILogger} from "../../../logger/models/app-logger";
import {CreateUserDto} from "../models/dto/create-user.dto";
import {User} from "../models/domain/user.entity";
import {UserTransformer} from "../transformers/user.transformer";
import {MicroServiceError} from "../../../exceptions/micro-service-error/micro-service-error";
import {ApiAuthErrorEnums} from "../enums/api-auth-error.enums";


@Injectable()
export class AuthService {

    private readonly TAG: string = `${this.constructor.name}`;

    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        private readonly appLogger: ILogger,
        private readonly jwtService: JwtService) {
        this.appLogger.log('Init', this.TAG);
    }

    async signUp(hashedPassword: string, createUserDto: CreateUserDto): Promise<User> {
        try {
            const userToCreate: User = UserTransformer.interfaceToEntity(createUserDto, hashedPassword);
            return await this.userRepository.saveUser(userToCreate);
        } catch (err) {
            this.appLogger.error(`Failed to sign up`, this.TAG);
            throw new MicroServiceError(ApiAuthErrorEnums.FAILED_TO_CREATE_USER, HttpStatus.BAD_REQUEST);
        }
    }

    async getLoggedUser(email: string): Promise<User> {
        try {
            return await this.userRepository.getUserByEmail(email);
        } catch (err) {
            this.appLogger.error(`Failed to find user by email`, this.TAG);
            throw new MicroServiceError(ApiAuthErrorEnums.FAILED_TO_FIND_USER, HttpStatus.BAD_REQUEST);
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    async createToken(findUser: User): Promise<string> {
        return await this.jwtService.signAsync({id: findUser.user_id, email: findUser.email});
    }
}
