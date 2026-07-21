import { AppException } from "../../common/exceptions/app.exception";

export abstract class RepositoryException extends AppException {
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}