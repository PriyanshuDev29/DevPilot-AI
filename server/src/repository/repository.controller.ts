import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ConnectedRepositoryResponse } from './interfaces/connected-repository-response.interface';

@Controller('repositories')
export class RepositoryController {

    constructor(private readonly repositoryService: RepositoryService) {}

    @Post('connect')
    @UseGuards(JwtAuthGuard)
    async connectRepository(@Body() dto: CreateRepositoryDto, @CurrentUser() user: AuthenticatedUser): Promise<ConnectedRepositoryResponse> {
        return this.repositoryService.connectRepository(user.id, dto.url);
    }

    @Post(":id/analyse")
    @UseGuards(JwtAuthGuard)
    async analyseRepository(@CurrentUser() user : AuthenticatedUser, @Param('id') id: string): Promise<void> {
        return this.repositoryService.analyseRepository(user.id, id);
    }

}
