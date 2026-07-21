import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { RepositoryException } from './repository.exception';

export class RepositoryNotFoundException extends RepositoryException {

    constructor(repositoryIdentifier: string) {
        super(`Repository ${repositoryIdentifier} not found`, HttpStatus.NOT_FOUND);
    }
}