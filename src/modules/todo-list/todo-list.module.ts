import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppConfigModule} from "../../config/app-config.module";
import {GuardModule} from "../../guards/guard.module";
import {LoggerModule} from "../../logger/logger.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "../../guards/auth/jwt.strategy";
import {AuthenticationController} from "./controllers/auth.controller";
import {User} from "./models/domain/user.entity";
import {UserRepository} from "./repositories/user.repository";
import {AuthProvider} from "./providers/auth.provider";
import {AuthService} from "./services/auth.service";
import {TaskController} from "./controllers/task.controller";
import {Task} from "./models/domain/task.entity";
import {TaskRepository} from "./repositories/task.repository";
import {TaskProvider} from "./providers/task.provider";
import {TaskService} from "./services/task.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserRepository]),
        TypeOrmModule.forFeature([Task, TaskRepository]),
        JwtModule.register({
            secret: process.env.SECRET,
            signOptions: {expiresIn: process.env.EXPIRE},
        }),
        AppConfigModule,
        GuardModule,
        LoggerModule,
        PassportModule,
    ],
    controllers: [
        AuthenticationController,
        TaskController
    ],
    providers: [
        JwtStrategy,
        AuthProvider,
        AuthService,
        TaskProvider,
        TaskService
    ],
    exports: [],
})
export class TodoListModule {
}
