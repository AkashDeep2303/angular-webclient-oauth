import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(public authService: AuthService) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'text/plain');

    if(this.authService.isUsingOIDC()){
      if(!request.url.includes('config.json')){
        request = request.clone({
          withCredentials: false,
          setHeaders:{
            Authorization: this.authService.authrorizationHeaderValue(),
          }
        });
      }
      
      return next.handle(request);
    }
    else{
      if(request.headers.get('ignoreInterceptor')){
        request = request.clone({
          withCredentials: true
        });
        return next.handle(request);
      }

      request = request.clone({
        headers, withCredentials: true
      });
      return next.handle(request);
    }
  }
}
