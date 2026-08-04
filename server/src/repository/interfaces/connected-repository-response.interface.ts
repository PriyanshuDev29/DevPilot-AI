import { RepositoryStatus } from '../enum/repository-status.enum';

export interface ConnectedRepositoryResponse {
    id: string;
    name: string;
    repositoryIdentifier: string;
    status: RepositoryStatus;
}