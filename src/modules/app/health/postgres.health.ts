import { Injectable } from '@nestjs/common';
import { getConnectionManager } from 'typeorm';
import { HealthCheckError } from '@godaddy/terminus';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { TypeOrmSQLConfigService } from '../../../database/type-orm-SQL-config.service';
import { ILogger } from '../../../logger/models/app-logger';

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator {
  protected TAG: string = `${this.constructor.name}`;

  constructor(private readonly appLogger: ILogger) {
    super();
    this.appLogger.log('Init', this.TAG);
  }

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const connectionManager = await getConnectionManager().get(TypeOrmSQLConfigService.SQL_CONNECTION_NAME);
      await connectionManager.query(`select * from pg_stat_activity`);
      return this.getStatus(key, true);
    } catch (error) {
      this.appLogger.error(error, this.TAG);
      throw new HealthCheckError(this.TAG +  ' Health failed', error);
    }
  }
}
