// import { ToastrService } from 'ngx-toastr';
// import { GlobalScope } from './../../services/globas';
import { Observable, throwError } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AddHeaderInterceptor implements HttpInterceptor {

  // constructor(private router: Router, private global: GlobalScope, private toastr: ToastrService) { }
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {};
    let clonedRequest = req;
    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          // 'X-Frame-Options': 'DENY',
          authorization: `Bearer ${token.token}`
        }
      });
      return next.handle(clonedRequest).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            if (localStorage.getItem('currentUser')) {
              localStorage.removeItem('currentUser');
            }
            this.router.navigate(['/login']);
          } else {
            // this.toastr.error(
            //   `Error al establecer conexión con el servidor`,
            //   'Error', { progressBar: true, enableHtml: true });
          }
          return throwError(err);
        })
      );
    }
    const clonedRequest1 = req.clone({ headers: req.headers.set('Authorization', 'null') });
    return next.handle(clonedRequest1).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if (!err.url.includes('login')) {
          if (err.status === 401) {
            if (localStorage.getItem('currentUser')) {
              localStorage.removeItem('currentUser');
            }
            // this.toastr.error(`<strong>Su sesión ha expirado</strong>`, 'Error', { progressBar: true, enableHtml: true });
            this.router.navigate(['/login']);
          } else {
            // this.toastr.error(
            //   `Error al establecer conexión con el servidor`,
            //   'Error', { progressBar: true, enableHtml: true });
          }
        }
        return throwError(err);
      })
    );
    }
  }
