import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbStatusService implements OnModuleInit {
  private readonly logger = new Logger('Database');

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('✅ Database already connected');
    } else {
      try {
        await this.dataSource.initialize();
        this.logger.log('✅ Successfully connected to the database');
      } catch (error) {
        this.logger.error('❌ Failed to connect to the database', error);
      }
    }
  }
}
