import {Module} from '@nestjs/common';
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from '@nestjs/typeorm';
import {AppConfigModule} from './config/app-config.module';
import {DatabaseModule} from './database/database.module';
import {TypeOrmSQLConfigService} from './database/type-orm-SQL-config.service';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import {CacheInterceptor} from './interceptors/cache.interceptor';
import {TimeoutInterceptor} from './interceptors/timeout.interceptor';
import {LoggerModule} from './logger/logger.module';
import {MicroServiceExceptionFilter} from './exceptions/micro-service-exception.filter';
import {PostgresHealthIndicator} from './modules/app/health/postgres.health';
import {MigrationHealthIndicator} from './modules/app/health/migration.health';
import {ApplicationInsightsInterceptor} from './interceptors/application-insights.interceptor';
import {HealthModule} from './modules/app/health/health.module';
import {JwtStrategy} from "./guards/auth/jwt.strategy";
import {SharedModule} from "./shared/shared.module";
import {TodoListModule} from "./modules/todo-list/todo-list.module";


@Module({
    imports: [
        HealthModule,
        SharedModule,
        TypeOrmModule.forRootAsync({
            imports: [DatabaseModule, TodoListModule],
            useExisting: TypeOrmSQLConfigService,
        } as TypeOrmModuleAsyncOptions),
        AppConfigModule,
        LoggerModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: MicroServiceExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ApplicationInsightsInterceptor,
        },
        PostgresHealthIndicator,
        MigrationHealthIndicator,
        JwtStrategy
    ],
    exports: [PostgresHealthIndicator, MigrationHealthIndicator],
})

export class AppModule {
}
