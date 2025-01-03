import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CommonSharedService } from '../service/common-shared.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  user : any;
  constructor(public commonSharedService : CommonSharedService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    if(this.commonSharedService.loginUser)
    {
      this.user = this.commonSharedService.loginUser;
      const isLoggedIn = this.user?.authToken;
      const isApiUrl = request.url.startsWith(environment.apiUrl);
      const isApiAdminUrl = request.url.startsWith(environment.apiAdminUrl);
      if (isLoggedIn && (isApiUrl || isApiAdminUrl)) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.user.authToken}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
