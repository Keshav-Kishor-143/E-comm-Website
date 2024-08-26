import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { cart, product } from '../data-type';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  totalCartData = new EventEmitter<product[] | []>();
  private baseUrlCart = 'http://localhost:3000/cart'; // Centralized base URL for products

  constructor(
    private http: HttpClient,
    private route: Router,
    private local: LocalStorageService
  ) {}

  cartDataToLocalStorage(data: product) {
    let currentCartData: product[] = [];
    let localCartData = this.local.getItem('CartItems');
    if (!localCartData) {
      this.local.setItem('CartItems', JSON.stringify([data]));
      this.totalCartData.emit([data]);
    } else {
      currentCartData = JSON.parse(localCartData);
      currentCartData.push(data);
      this.local.setItem('CartItems', JSON.stringify(currentCartData));
      this.totalCartData.emit(currentCartData);
    }
  }

  // Get Cart items by ID from database
  getCartItemsBasedOnId(id: string) {
    return this.http
      .get<product[]>(`${this.baseUrlCart}?userId=${id}`, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.totalCartData.emit(result.body);
        }
      });
  }

  //Update Cart Database
  addToCartDatabase(cartData: cart) {
    return this.http.post(this.baseUrlCart, cartData);
  }

  //Method to remove cart items for non logged in user from Local Storage
  removeCartItemFromLocalStorage(productId: string) {
    let currentCartData = localStorage.getItem('CartItems');
    if (currentCartData) {
      let items: product[] = JSON.parse(currentCartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.totalCartData.emit(items);
    }
  }

  //Method to remove cart items for logged in user from Database
  removeCartItemFromDatabase(cartId: string) {
    return this.http.delete(this.baseUrlCart + cartId);
  }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
