import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbConfigModule } from './dbconfig';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,                
      envFilePath: '../../.env',
      // ignoreEnvFile: process.env.NODE_ENV === 'production', // Ignore .env in production

    }), DbConfigModule, UsersModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
