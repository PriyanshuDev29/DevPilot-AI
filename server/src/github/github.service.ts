import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GithubRepositoryMetadata } from './interfaces/repository-metadata.interface';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestHeaders } from 'axios';
import { GithubRepositoryResponse } from './interfaces/github-repository-response.interface';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GithubRepositoryNotFoundException } from './exceptions/github-repository-not-found.exception';
import { GithubRateLimitException } from './exceptions/github-rate-limit.exception';
import { GithubUnavailableException } from './exceptions/github-unavailable.exception';

@Injectable()
export class GithubService {

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

    async fetchRepositoryMetadata(repositoryIdentifier: string): Promise<GithubRepositoryMetadata> {

        const repositoryResponse = await this.getRepository(repositoryIdentifier);

        return this.mapRepositoryMetadata(repositoryResponse);
    }

    private buildRepositoryApiUrl(repositoryIdentifier: string): string {
        const base = this.configService.getOrThrow<string>('GITHUB_API_URL');
        const githubUrl = `${base}/repos/${repositoryIdentifier}`;
        return githubUrl;
    }

    private getDefaultHeaders(): AxiosRequestHeaders {
        return {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': this.configService.getOrThrow('GITHUB_API_VERSION'),
            'User-Agent': 'RepoSense-AI',
        } as unknown as AxiosRequestHeaders;
    }

    private async getRepository(repositoryIdentifier: string): Promise<GithubRepositoryResponse> {

        const url = this.buildRepositoryApiUrl(repositoryIdentifier);

        const headers = this.getDefaultHeaders();

        try{
            const response = await firstValueFrom(
                this.httpService.get<GithubRepositoryResponse>(url, { headers })
            )

            return response.data;
        }
        catch(error){
            if(!(error instanceof AxiosError)){
                throw error;
            }
            const status = error.response?.status;
            if(status === 404){
                throw new GithubRepositoryNotFoundException(repositoryIdentifier);
            }
            else if(status === 403){
                throw new GithubRateLimitException();
            }
            else{
                throw new GithubUnavailableException();
            }
        }
    }

    private mapRepositoryMetadata(response: GithubRepositoryResponse): GithubRepositoryMetadata {
        return {
            name: response.name,
            defaultBranch: response.default_branch,
            isPrivate: response.private
        }
    }
}
