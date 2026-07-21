import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule {}
