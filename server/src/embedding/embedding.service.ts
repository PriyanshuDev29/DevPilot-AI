import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbeddingGenerationException } from './exceptions/embedding-generation.exception';

@Injectable()
export class EmbeddingService {

    private readonly ai: GoogleGenerativeAI;

    constructor(private readonly configService: ConfigService){
        this.ai = new GoogleGenerativeAI(
            this.configService.getOrThrow<string>('GEMINI_API_KEY')
        );
    }

    async generateEmbedding(text: string): Promise<number[]>{

        try{
            const model = this.ai.getGenerativeModel({
                model: this.configService.getOrThrow<string>('GEMINI_EMBEDDING_MODEL')
            });

            const response = await model.embedContent(text)

            return response.embedding.values;
        }
        catch(error){
            console.error(error);
            throw new EmbeddingGenerationException();
        }
    }
}
