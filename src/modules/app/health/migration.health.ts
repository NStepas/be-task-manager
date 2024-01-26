import { Injectable } from '@nestjs/common';
import { getConnectionManager } from 'typeorm';
import { HealthCheckError } from '@godaddy/terminus';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { TypeOrmSQLConfigService } from '../../../database/type-orm-SQL-config.service';
import { ILogger } from '../../../logger/models/app-logger';

@Injectable()
export class MigrationHealthIndicator extends HealthIndicator {
  protected TAG: string = `${this.constructor.name}`;
  public static MIGRATION_STATUS: boolean = false;
  constructor(private readonly appLogger: ILogger) {
    super();
    this.appLogger.log('Init', this.TAG);
  }

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (MigrationHealthIndicator.MIGRATION_STATUS) {
        return this.getStatus(key, true);
      }
      await getConnectionManager().get(TypeOrmSQLConfigService.SQL_CONNECTION_NAME).runMigrations();
      MigrationHealthIndicator.MIGRATION_STATUS = true;
      return this.getStatus(key, true);
    } catch (error) {
      this.appLogger.error(error, this.TAG);
      throw new HealthCheckError(this.TAG +  ' Health failed', error);
    }
  }
}
