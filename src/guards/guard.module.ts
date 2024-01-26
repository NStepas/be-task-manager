import {Module} from '@nestjs/common';
import {LoggerModule} from '../logger/logger.module';

@Module({
    imports: [LoggerModule],
    controllers: [],
    providers: [],
    exports: []

})

export class GuardModule {
}
