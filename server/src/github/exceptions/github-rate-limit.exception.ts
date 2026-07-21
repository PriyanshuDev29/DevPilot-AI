import {GithubException} from './github.exception';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export class GithubRateLimitException extends GithubException {

    constructor(){
        super('GitHub API rate limit exceeded. Please try again later.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}