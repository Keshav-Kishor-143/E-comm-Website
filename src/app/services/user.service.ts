import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { login, signUp } from '../data-type';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userUrl = 'http://localhost:3000/user';
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  //User sign up using api
  userSignUp(data: signUp): void {
    this.http
      .post<HttpResponse<any>>(this.userUrl, data, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 201) {
            this.handleSuccessfulSignUp(response.body);
          } else {
            this.handleFailedSignUp();
          }
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  //User login using api
  userLogin(data: login): Observable<HttpResponse<any>> {
    const url = `${this.userUrl}?email=${data.email}&password=${data.password}`;
    return this.http.get<HttpResponse<any>>(url, { observe: 'response' });
  }

  //Reload User data based on the Authentication gaurd
  reloadUser(): void {
    if (this.isBrowserEnvironment() && this.localStorage.getItem('user')) {
      this.isUserLoggedIn.next(true);
      this.router.navigate(['/home']);  
    }
  }

  //Environment method check for localStorage in Browser environment
  private isBrowserEnvironment(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  //Successful sign up handling
  private handleSuccessfulSignUp(sellerData: any): void {
    this.isUserLoggedIn.next(true);
    this.localStorage.setItem('user', JSON.stringify(sellerData));
    this.router.navigate(['/home']);
  }

  //Un-successful sign up handling
  private handleFailedSignUp(): void {
    this.isUserLoggedIn.next(false);
  }

  //Signup error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Signup failed', error);
    this.isUserLoggedIn.next(false);
    throw error;
  }
}
