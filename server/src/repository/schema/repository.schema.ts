import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/users/schemas/users.schema";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { RepositoryStatus } from "../enum/repository-status.enum";

@Schema({timestamps: true})
export class Repository {

    @Prop()
    name?: string;

    @Prop({required: true})
    repositoryIdentifier!: string;

    @Prop({required: true})
    url!: string;

    @Prop()
    defaultBranch?: string;

    @Prop()
    isPrivate?: boolean;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
        required: true
    })
    user!: User;

    @Prop({
        type: String,
        enum: RepositoryStatus,
        default: RepositoryStatus.CONNECTED
    })
    status!: RepositoryStatus;

    @Prop()
    localPath!:string;

}

export type RepositoryDocument = HydratedDocument<Repository>;

export const RepositorySchema = SchemaFactory.createForClass(Repository);

RepositorySchema.index({user: 1, repositoryIdentifier: 1}, {unique: true});         // 1 --> Sort this field in ascending order. -1 --> Sort this field in descending order.