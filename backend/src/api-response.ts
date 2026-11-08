import {
  ArgumentsHost, CallHandler, Catch, ExceptionFilter,
  ExecutionContext, HttpException, Injectable, Logger, NestInterceptor,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { map } from 'rxjs';
import type { Response } from 'express';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(map(result => {
      if (response.statusCode === 204) return undefined;
      return {
        isSuccess: true,
        code: 'COMMON' + response.statusCode,
        message: '요청을 성공적으로 처리했습니다.',
        result: result ?? null,
      };
    }));
  }
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    let status = 500;
    let message = '서버 오류가 발생했습니다.';

    if (error instanceof HttpException) {
      status = error.getStatus();
      const body = error.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else {
        const value = (body as { message?: string | string[] }).message;
        message = Array.isArray(value)
          ? value.join(', ') : value ?? error.message;
      }
    } else if (error instanceof QueryFailedError) {
      const driver = error.driverError as { code?: string };
      if (driver.code === 'ER_DUP_ENTRY') {
        status = 409;
        message = '이미 등록된 이메일, 닉네임 또는 평점입니다.';
      }
    }

    if (status === 500) {
      Logger.error('예상하지 못한 서버 오류', 'ApiExceptionFilter');
    }

    response.status(status).json({
      isSuccess: false,
      code: 'COMMON' + status,
      message,
      result: null,
    });
  }
}
