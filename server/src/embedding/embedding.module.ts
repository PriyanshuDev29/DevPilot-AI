import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { EmbeddingService } from './embedding.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Embedding, EmbeddingSchema } from './schemas/embedding.schema';

@Module({
    imports: [ConfigModule,
        MongooseModule.forFeature([{ name: Embedding.name, schema: EmbeddingSchema }])
    ],
    providers: [EmbeddingService],
    exports: [EmbeddingService, MongooseModule],
})
export class EmbeddingModule {}