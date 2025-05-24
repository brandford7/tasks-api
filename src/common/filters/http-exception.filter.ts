/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Extracting message from possible formats
    let message: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      Array.isArray((exceptionResponse as { message?: unknown }).message)
    ) {
      message = (
        (exceptionResponse as { message?: unknown }).message as string[]
      ).join(', ');
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      typeof (exceptionResponse as { message?: unknown }).message === 'string'
    ) {
      message =
        (exceptionResponse as { message?: string }).message ||
        'Something went wrong';
    } else {
      message = 'Something went wrong';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
