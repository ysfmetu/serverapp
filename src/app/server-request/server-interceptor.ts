import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ServerRequestInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('xx');
    let nreq = req.clone({
      setHeaders: {
        Authentication: this.authService.authenticated
          ? `Bearer ${this.authService.token}`
          : '',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return next.handle(nreq).pipe(
      map((res) => {
        if (res instanceof HttpResponse) {
          if (res.body) {
            if (res.body.message) {
            }
          }
        }
        return res;
      }),
      catchError((e) => {
        if (e.error.status == 401) {
          this.router.navigate(['auth']);
        }

        // this.messageService.showMessage({
        //   success: false,
        //   message: 'Servis Hatası',
        //   errors: [e.error.message],
        // });
        return throwError(e);
      })
    );
  }
}
