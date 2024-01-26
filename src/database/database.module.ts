import { Module } from '@nestjs/common';
import { TypeOrmSQLConfigService } from './type-orm-SQL-config.service';
import { AppConfigModule } from '../config/app-config.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [AppConfigModule, LoggerModule],
  providers: [TypeOrmSQLConfigService],
  exports: [TypeOrmSQLConfigService],
})
export class DatabaseModule {}
