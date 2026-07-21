import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppException } from '../exceptions/app.exception';

@Catch(AppException)
export class DomainExceptionFilter implements ExceptionFilter<AppException> {

  catch(exception: AppException, host: ArgumentsHost): void {

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = (exception as any).statusCode ?? (exception as any).status ?? 500;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}