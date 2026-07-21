import { AppException } from "../../common/exceptions/app.exception";

export abstract class GithubException extends AppException {
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}