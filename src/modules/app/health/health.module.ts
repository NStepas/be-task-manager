import { TerminusModule } from '@nestjs/terminus';
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { LoggerModule } from '../../../logger/logger.module';
import { PostgresHealthIndicator } from './postgres.health';
import { MigrationHealthIndicator } from './migration.health';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, LoggerModule],
  providers: [PostgresHealthIndicator, MigrationHealthIndicator],
})
export class HealthModule {}
