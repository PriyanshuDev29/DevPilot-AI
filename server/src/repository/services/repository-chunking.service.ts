import { Injectable } from '@nestjs/common';
import { RepositoryFile } from '../interfaces/repository-file.interface';
import { RepositoryChunk } from '../interfaces/repository-chunk.interface';

@Injectable()
export class RepositoryChunkingService {

    private readonly chunkSize=1000;

    private readonly overlap=200;

    chunkRepository(files: RepositoryFile[]): RepositoryChunk[] {

        const chunks: RepositoryChunk[] = [];

        for(const file of files){
            chunks.push(...this.chunkFile(file));
        }

        return chunks;
    }

    private chunkFile(file: RepositoryFile): RepositoryChunk[] {
        let start=0;
        const repositoryChunks: RepositoryChunk[]=[];

        while(start<file.content.length){
            const end=Math.min(start+this.chunkSize,file.content.length);
            const chunkContent=file.content.substring(start,end);
            repositoryChunks.push({
                relativePath:file.relativePath,
                content:chunkContent
            });
            start+=this.chunkSize-this.overlap;
        }

        return repositoryChunks;
    }
}