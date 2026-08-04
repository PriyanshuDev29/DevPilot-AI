import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { RepositoryException } from './repository.exception';

export class RepositoryAlreadyConnectedException extends RepositoryException {

    constructor(repositoryIdentifier: string) {
        super(`Repository ${repositoryIdentifier} is already connected`, HttpStatus.CONFLICT);
    }
}