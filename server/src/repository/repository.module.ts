import { Module } from '@nestjs/common';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositorySchema } from './schema/repository.schema';
import { RepositoryUrlService } from './services/repository-url.service';
import { GithubModule } from 'src/github/github.module';
import { RepositoryAnalysisService } from './services/repository-analysis.service';
import { RepositoryCloneService } from './services/repository-clone.service';
import { RepositoryTraversalService } from './services/repository-traversal.service';
import { RepositoryFileReaderService } from './services/repository-reader-file.service';

@Module({
  imports: [GithubModule,
    MongooseModule.forFeature([{ name: 'Repository', schema: RepositorySchema }])
  ],
  controllers: [RepositoryController],
  providers: [RepositoryService, RepositoryUrlService, RepositoryCloneService, RepositoryAnalysisService, RepositoryTraversalService,
    RepositoryFileReaderService
  ],
})
export class RepositoryModule {}
