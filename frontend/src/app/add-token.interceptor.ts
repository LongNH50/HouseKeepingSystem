import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';
import { StateService } from './state.service';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor() { }

  private stateService = inject(StateService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
    const token = this.stateService.getToken();
    if (token) {
      const clone = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(clone);
    } else {
      return next.handle(request);
    }
  }

}
