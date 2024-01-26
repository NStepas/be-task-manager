import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppConfigService } from './app-config.service';
import databaseConfig from './database.config';
import appConfig from './app.config';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['production.env', '.staging.env', 'development.env'],
      load: [databaseConfig, appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'staging')
          .default('development'),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_SCHEMA: Joi.string(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    LoggerModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
