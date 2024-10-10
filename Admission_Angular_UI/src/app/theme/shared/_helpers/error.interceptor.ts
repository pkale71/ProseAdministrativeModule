import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonSharedService } from '../service/common-shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router : Router, private commonSharedService : CommonSharedService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if ([401, 403].includes(err.status)) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          window.open(this.commonSharedService.adminBaseUrl + '/auth/signin', "_self");
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
