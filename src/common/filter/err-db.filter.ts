import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception);


    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;
      return response.status(status).json({
        statusCode: status,
        message,
      });
    }

    switch (exception?.code) {
      // 23505: unique_violation
      case '23505':
        return response.status(400).json({
          statusCode: 400,
          message:
            exception.detail || 'Duplicate key violates unique constraint',
        });
      // 23503: foreign_key_violation
      case '23503':
        return response.status(400).json({
          statusCode: 400,
          message:
            exception.detail ||
            'Foreign key violation — referenced record not found',
        });
      // 23502: not_null_violation
      case '23502':
        return response.status(400).json({
          statusCode: 400,
          message:
            exception.detail || `Missing required field: ${exception.column}`,
        });
      // 22P02: invalid_text_representation (ej: id = "abc")
      case '22P02':
        return response.status(400).json({
          statusCode: 400,
          message: exception.detail || 'Invalid data type received',
        });
      default:
        return response.status(500).json({
          statusCode: 500,
          message: exception.detail || 'Unexpected database error — check logs',
        });
    }
  }
}