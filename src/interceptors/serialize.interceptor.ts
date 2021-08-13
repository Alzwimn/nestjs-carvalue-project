import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a resquest is handled
    // by the request handler
    console.log('[SerializeInterceptor] I am running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run before the response is sent out
        console.log('[SerializeInterceptor] I am running before response is sent out', data);
      }),
    );
  }
}
