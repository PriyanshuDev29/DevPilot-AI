import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema({timestamps: true})
export class Embedding {

    @Prop({
        type:MongooseSchema.Types.ObjectId,
        ref: 'Repository',
        required: true
    })
    repository!: string;

    @Prop({required: true})
    relativePath!: string

    @Prop({required: true})
    content!: string;

    @Prop({
        type: [Number],
        required: true
    })
    embedding!: number[];

}

export type EmbeddingDocument = HydratedDocument<Embedding>;

export const EmbeddingSchema = SchemaFactory.createForClass(Embedding);  

EmbeddingSchema.index({repository: 1})