import { Injectable } from '@nestjs/common';
import { RepositoryUrlService } from './services/repository-url.service';
import { RepositoryDocument } from './schema/repository.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from './schema/repository.schema';
import { RepositoryAlreadyConnectedException } from './exceptions/repository-already-connected.exception';
import { GithubService } from 'src/github/github.service';
import { ConnectedRepositoryResponse } from './interfaces/connected-repository-response.interface';
import { GithubRepositoryMetadata } from 'src/github/interfaces/repository-metadata.interface';
import { RepositoryNotFoundException } from './exceptions/repository-not-found.exception';
import { RepositoryAnalysisService } from './services/repository-analysis.service';
import { RepositoryStatus } from './enum/repository-status.enum';

@Injectable()
export class RepositoryService {

    constructor(@InjectModel(Repository.name) private readonly repositoryModel: Model<RepositoryDocument>, private readonly repositoryUrlService: RepositoryUrlService, private readonly githubService: GithubService,
                private readonly repositoryAnalysisService: RepositoryAnalysisService) {}

    private async ensureRepositoryNotConnected(userId: string, repositoryIdentifier: string): Promise<void> {
        const existingRepository = await this.repositoryModel.findOne({ user: userId, repositoryIdentifier }).exec();

        if(existingRepository){
            throw new RepositoryAlreadyConnectedException(repositoryIdentifier);
        }
    }

    private createRepositoryDocument(userId: string, repositoryIdentifier: string, url: string, repositoryMetadata: GithubRepositoryMetadata): RepositoryDocument {
        const newRepository = new this.repositoryModel({
            name: repositoryMetadata.name,
            repositoryIdentifier: repositoryIdentifier,
            url: url,
            defaultBranch: repositoryMetadata.defaultBranch,
            isPrivate: repositoryMetadata.isPrivate,
            user: userId
        });
        return newRepository;
    }

    private async findRepository(userId: string, repositoryId: string): Promise<RepositoryDocument> {
        
        const repository = await this.repositoryModel.findOne({ _id: repositoryId, user: userId }).exec();

        if(!repository){
            throw new RepositoryNotFoundException(repositoryId);
        }

        return repository;;
    }

    async connectRepository(userId: string, repositoryUrl: string): Promise<ConnectedRepositoryResponse> {

        const normalisedUrl = this.repositoryUrlService.normaliseUrl(repositoryUrl);

        const extractedRepositoryIdentifier = this.repositoryUrlService.extractRepositoryIdentifier(normalisedUrl);

        await this.ensureRepositoryNotConnected(userId, extractedRepositoryIdentifier);

        const repositoryMetadata = await this.githubService.fetchRepositoryMetadata(extractedRepositoryIdentifier);

        const newRepository = this.createRepositoryDocument(
            userId,
            extractedRepositoryIdentifier,
            normalisedUrl,
            repositoryMetadata
        );

        const savedRepository = await newRepository.save();

        return {
            id: savedRepository._id.toString(),
            name: savedRepository.name ? savedRepository.name : '',
            repositoryIdentifier: savedRepository.repositoryIdentifier,
            status: savedRepository.status
        }
    }

    async analyseRepository(userId: string, repositoryId: string): Promise<void> {

        const repository = await this.findRepository(userId, repositoryId);

        const localPath = await this.repositoryAnalysisService.analyseRepository(repository);

        repository.localPath = localPath;

        repository.status = RepositoryStatus.ANALYZING;

        await repository.save();
    }
}
