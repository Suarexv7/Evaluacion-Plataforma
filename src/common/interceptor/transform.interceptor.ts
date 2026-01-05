import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse();
    const request: Request = context.switchToHttp().getRequest();

    const statusCode = response.statusCode;
    const method = request.method;
    const path = request.url;
    return next.handle().pipe(
      map((responseData) => {
        const isObject = responseData && typeof responseData === 'object';

        const data =
          isObject && 'data' in responseData ? responseData.data : responseData;
        const message =
          isObject && 'message' in responseData ? responseData.message : 'OK';
        return {
          success: true,
          statusCode,
          method,
          path,
          message,
          data,
        };
      }),
    );
  }
}