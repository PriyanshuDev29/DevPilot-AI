import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository, RepositoryDocument } from '../schema/repository.schema';
import { RepositoryCloneService } from './repository-clone.service';
import { RepositoryTraversalService } from './repository-traversal.service';
import { RepositoryFileReaderService } from './repository-reader-file.service';
import * as path from 'path';
import { RepositoryFile } from '../interfaces/repository-file.interface';
import { Model } from 'mongoose';
import { Embedding, EmbeddingDocument } from '../../embedding/schemas/embedding.schema';
import { RepositoryChunkingService } from './repository-chunking.service';
import { EmbeddingService } from '../../embedding/embedding.service';
import { RepositoryChunk } from '../interfaces/repository-chunk.interface';
import { RepositoryStatus } from '../enum/repository-status.enum';
import * as fs from 'fs';

@Injectable()
export class RepositoryAnalysisService {

    constructor(private readonly repositoryCloneService: RepositoryCloneService, private readonly repositoryTraversalService: RepositoryTraversalService,
        private readonly repositoryFileReaderService: RepositoryFileReaderService,
        private readonly chunkingService: RepositoryChunkingService,
        private readonly embeddingService: EmbeddingService,
        @InjectModel(Embedding.name) private readonly embeddingModel: Model<EmbeddingDocument>
    ) {}

    private async resolveLocalPath(repository: RepositoryDocument): Promise<string> {
        const existingLocalPath = repository.localPath;

        if (existingLocalPath) {
            try {
                await fs.promises.access(existingLocalPath);
                return existingLocalPath;
            }
            catch {
                // Fall through to a fresh clone when the stored path is stale.
            }
        }

        return this.repositoryCloneService.cloneRepository(repository);
    }

    private async generateEmbeddings(repository: RepositoryDocument, chunks: RepositoryChunk[]): Promise<void> {
        const embeddings: Partial<Embedding>[] = [];

        for(const chunk of chunks){
            const emdeddingValues = await this.embeddingService.generateEmbedding(chunk.content);

            embeddings.push({
                repository: repository._id.toString(),
                relativePath: chunk.relativePath,
                content: chunk.content,
                embedding: emdeddingValues
            })
        }
        await this.embeddingModel.insertMany(embeddings);
    }

    async analyseRepository(repository: RepositoryDocument): Promise<string> {

        try{

            repository.status = RepositoryStatus.ANALYZING;
            await repository.save();

            const localPath = await this.resolveLocalPath(repository);

            const filePaths = await this.repositoryTraversalService.getRepositoryFiles(localPath);

            const repositoryFiles: RepositoryFile[] = [];

            for(const file of filePaths){
                const content = await this.repositoryFileReaderService.readFile(file);

                repositoryFiles.push({
                    relativePath: path.relative(localPath, file),
                    content: content
                })
            }

            const repositoryChunks = this.chunkingService.chunkRepository(repositoryFiles);

            await this.generateEmbeddings(repository, repositoryChunks);

            repository.localPath = localPath;
            repository.status = RepositoryStatus.COMPLETED;

            await repository.save();

            return localPath;
        }
        catch(error){

            repository.status = RepositoryStatus.FAILED;
            await repository.save();
            throw error;
        }
    }
}