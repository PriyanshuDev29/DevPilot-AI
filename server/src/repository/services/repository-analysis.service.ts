import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository, RepositoryDocument } from '../schema/repository.schema';
import { RepositoryCloneService } from './repository-clone.service';
import { RepositoryTraversalService } from './repository-traversal.service';
import { RepositoryFileReaderService } from './repository-reader-file.service';
import * as path from 'path';
import { RepositoryPath } from '../interfaces/repository-path.interface';

@Injectable()
export class RepositoryAnalysisService {

    constructor(private readonly repositoryCloneService: RepositoryCloneService, private readonly repositoryTraversalService: RepositoryTraversalService,
        private readonly repositoryFileReaderService: RepositoryFileReaderService
    ) {}

    async analyseRepository(repository: RepositoryDocument): Promise<string> {

        const localPath = repository.localPath ?? await this.repositoryCloneService.cloneRepository(repository);

        const filePaths = await this.repositoryTraversalService.getRepositoryFiles(localPath);

        const repositoryFiles: RepositoryPath[] = [];

        for(const file of filePaths){
            const content = await this.repositoryFileReaderService.readFile(file);

            repositoryFiles.push({
                relativePath: path.relative(localPath, file),
                content: content
            })
        }

        return localPath;
    }
}