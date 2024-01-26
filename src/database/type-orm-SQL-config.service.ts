import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {AppConfigService} from '../config/app-config.service';
import {ILogger} from '../logger/models/app-logger';

@Injectable()
export class TypeOrmSQLConfigService implements TypeOrmOptionsFactory {
    private readonly TAG: string = `${this.constructor.name}`;
    public static SQL_CONNECTION_NAME: string = 'postgres';

    constructor(private readonly configService: AppConfigService,
                private readonly appLogger: ILogger) {
        this.appLogger.log(this.TAG, 'Init, host: ' + this.configService.host);
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            name: TypeOrmSQLConfigService.SQL_CONNECTION_NAME,
            type: 'postgres',
            synchronize: true,
            logging: true,
            host: this.configService.host,
            port: this.configService.port,
            username: this.configService.username,
            password: this.configService.password,
            database: this.configService.database,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
    }
}
