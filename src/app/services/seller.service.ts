import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { login, signUp } from '../data-type';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private readonly sellerUrl = 'http://localhost:3000/seller';
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  loginError: string = '';


  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  //Seller sign up api call
  sellerSignUp(data: signUp): void {
    this.http
      .post<HttpResponse<any>>(this.sellerUrl, data, { observe: 'response' })
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

  //Seller login api call
  sellerLogin(data: login): void {
    const url = `${this.sellerUrl}?email=${data.email}&password=${data.password}`;
    this.http.get<HttpResponse<any>>(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response && response.status === 200 && response.body && response.body.length > 0) {
          const seller = response.body[0];
          if (seller.password === data.password) {
            this.isSellerLoggedIn.next(true);
            this.localStorage.setItem('seller', JSON.stringify(seller));
            this.router.navigate(['seller-home']);
          } else {
            this.loginError = 'Incorrect password';
          }
        } else {
          this.loginError = 'Email not found';
        }
      }),
      catchError(this.handleError)
    )
    .subscribe();
  }

  //Reload Seller data based on the Authentication gaurd
  reloadSeller(): void {
    if (this.isBrowserEnvironment() && this.localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  //Successful sign up handling
  private handleSuccessfulSignUp(sellerData: any): void {
    this.isSellerLoggedIn.next(true);
    this.localStorage.setItem('seller', JSON.stringify(sellerData));
    this.router.navigate(['seller-home']);
  }

  //Un-successful sign up handling
  private handleFailedSignUp(): void {
    this.isSellerLoggedIn.next(false);
  }

  //Signup error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Signup failed', error);
    this.isSellerLoggedIn.next(false);
    throw error;
  }

  //Environment method check for localStorage in Browser environment
  private isBrowserEnvironment(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
