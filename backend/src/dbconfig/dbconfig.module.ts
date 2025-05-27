import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbStatusService } from './dbstatus.service';


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || true ,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        logging: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
  providers: [DbStatusService],
})
export class DbConfigModule {}
