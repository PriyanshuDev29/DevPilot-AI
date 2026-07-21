import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository, RepositoryDocument } from '../schema/repository.schema';
import * as path from 'path';
import * as fs from 'fs';
import { error } from 'console';
import { exec } from 'child_process';

@Injectable()
export class RepositoryCloneService {

    private getClonePath(repository: RepositoryDocument): string {

        const clonePath = path.join(
            process.cwd(),
            'storage',
            'repositories',
            repository._id.toString()
        )

        return clonePath;
    }

    private async ensureDirectoryExists(): Promise<void> {

        await fs.promises.mkdir(path.join(
            process.cwd(),
            'storage',
            'repositories'), { recursive: true });
    }

    private async executeGitClone(repositoryUrl: string, clonePath: string): Promise<void> {

        return new Promise((resolve, reject) => {
            exec(
                `git clone ${repositoryUrl} "${clonePath}"`,
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                },
            );
        });
    }

    async cloneRepository(repository: RepositoryDocument): Promise<string>{

        const clonePath = this.getClonePath(repository);

        await this.ensureDirectoryExists();

        await this.executeGitClone(repository.url, clonePath);

        return clonePath;

    }
}