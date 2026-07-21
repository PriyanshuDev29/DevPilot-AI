import { HttpStatus } from '@nestjs/common';
import { RepositoryException } from './repository.exception';

export class InvalidRepositoryUrlException extends RepositoryException {

    constructor() {
        super(
            'Invalid GitHub repository URL.',
            HttpStatus.BAD_REQUEST,
        );
    }

}