import { AppException } from '../../common/exceptions/app.exception';

export class EmbeddingGenerationException extends AppException {

    constructor() {
        super('Failed to generate embedding', 500);
    }

}