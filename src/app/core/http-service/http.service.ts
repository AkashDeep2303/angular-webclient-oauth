import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../features/Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly BASE_URL: any;



  constructor(private readonly http: HttpClient, private readonly configService: ConfigService, private readonly router: Router) {
    this.BASE_URL = configService.getConfig("baseUrl"); 

  }

  get<T>(route: string){
    var res = this.http.get<T>(`${this.BASE_URL+route}`).pipe(catchError(this.handleError));
    return res;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || 403 || 500) {
      // A client-side or network error occurred. Handle it accordingly.
      sessionStorage.removeItem('id_token');
      window.location.href = '';
      this.router.navigate(['']);
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
