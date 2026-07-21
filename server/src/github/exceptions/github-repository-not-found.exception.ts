import { GithubException } from './github.exception';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export class GithubRepositoryNotFoundException extends GithubException {

    constructor(repositoryIdentifier: string) {
        super(`GitHub repository '${repositoryIdentifier}' not found.`, HttpStatus.BAD_REQUEST);
    }
}