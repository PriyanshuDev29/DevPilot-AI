import { Injectable } from '@nestjs/common';
import { InvalidRepositoryUrlException } from '../exceptions/invalid-repository-url.exception';

@Injectable()
export class RepositoryUrlService {

    normaliseUrl(url: string): string {

        let parsedUrl: URL;

        try {
            parsedUrl = new URL(url);
        } catch {
            throw new InvalidRepositoryUrlException();
        }

        if (parsedUrl.hostname !== 'github.com') {
            throw new InvalidRepositoryUrlException();
        }

        parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, '');

        return parsedUrl.toString();
    }

    extractRepositoryIdentifier(url: string): string {

        const parsedUrl = new URL(url);

        const segments = parsedUrl.pathname
            .split('/')
            .filter(Boolean);

        if (segments.length !== 2) {
            throw new InvalidRepositoryUrlException();
        }

        const owner = segments[0];
        const repository = segments[1].replace(/\.git$/, '');

        return `${owner}/${repository}`;
    }
}