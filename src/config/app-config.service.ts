import {ConfigService} from '@nestjs/config';
import {Injectable} from '@nestjs/common';
import {ILogger} from '../logger/models/app-logger';

@Injectable()
export class AppConfigService {

    constructor(
        private readonly configService: ConfigService,
        private readonly appLogger: ILogger,
    ) {
        this.appLogger.log('Init', this.constructor.name);
    }

    get isProduction(): boolean {
        return this.configService.get('application.nodeEnv') === 'production';
    }

    get host(): string {
        return String(process.env.DB_HOST);
    }

    get port(): number {
        return Number(process.env.DB_PORT);
    }

    get username(): string {
        return String(process.env.DB_USERNAME);
    }

    get password(): string {
        return String(process.env.DB_PASSWORD);
    }

    get database(): string {
        return String(process.env.DB_SCHEMA);
    }
}
