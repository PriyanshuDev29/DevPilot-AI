import {GithubException} from './github.exception';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export class GithubUnavailableException extends GithubException {

    constructor() {
        super('GitHub API is currently unavailable. Please try again later.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}  