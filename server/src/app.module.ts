import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { RepositoryModule } from './repository/repository.module';
import { AiModule } from './ai/ai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule, UsersModule, ProjectsModule, RepositoryModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
