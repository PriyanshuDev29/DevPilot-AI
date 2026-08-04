
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository, RepositoryDocument } from '../schema/repository.schema';
import { RepositoryCloneService } from './repository-clone.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RepositoryFileReaderService {

    async readFile(filePath: string): Promise<string> {

        const fileContent = await fs.promises.readFile(filePath, 'utf-8');

        return fileContent;
    }
}