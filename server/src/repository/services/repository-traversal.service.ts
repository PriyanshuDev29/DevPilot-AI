import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository, RepositoryDocument } from '../schema/repository.schema';
import { RepositoryCloneService } from './repository-clone.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RepositoryTraversalService {

    private readonly ignoreDirectories = new Set([
        ".git",
        ".github",
        "node_modules",
        "dist",
        "build",
        "coverage",
        ".next",
    ])

    private shouldIgnore(directoryName: string): boolean {
        return this.ignoreDirectories.has(directoryName);
    }

    private async traverseDirectory(directoryPath: string, files: string[]): Promise<void> {

        const entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });

        for(const entry of entries){

            const fullPath = path.join(directoryPath, entry.name);

            if(entry.isDirectory()){

                if(this.shouldIgnore(entry.name)){
                    continue;
                }

                await this.traverseDirectory(fullPath, files);
            }

            else{
                files.push(fullPath);
            }
        }
    }

    async getRepositoryFiles(localPath: string): Promise<string[]> {

        const files: string[] =[];

        await this.traverseDirectory(localPath, files);

        return files;
    }
}