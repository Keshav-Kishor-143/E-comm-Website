import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrlProducts = 'http://localhost:3000/products'; // Centralized base URL for products

  constructor(private http: HttpClient, private route: Router) {}

  // Add a new product
  addProduct(data: product): Observable<any> {
    return this.http
      .post(`${this.baseUrlProducts}`, data, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  // Get the list of all products
  getProductList(): Observable<product[]> {
    return this.http
      .get<product[]>(this.baseUrlProducts)
      .pipe(catchError(this.handleError));
  }

  // Delete a product by ID
  deleteProductBasedOnId(id: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrlProducts}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get a product by ID
  getProductBasedOnId(id: string): Observable<product> {
    return this.http
      .get<product>(`${this.baseUrlProducts}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update a product by ID
  updateProductBasedOnId(product: product): Observable<product> {
    return this.http
      .put<product>(`${this.baseUrlProducts}/${product.id}`, product)
      .pipe(catchError(this.handleError));
  }

  // Get popular products (limit to 3) (currently not using limits)
  popularProducts(): Observable<product[]> {
    return (
      this.http
        // .get<product[]>(`${this.baseUrl}?_limit=3`)
        .get<product[]>(`${this.baseUrlProducts}`)
        .pipe(catchError(this.handleError))
    );
  }

  // Get trendy products (limit to 8) (currently not using limits)
  getTrendyProducts(): Observable<product[]> {
    return (
      this.http
        // .get<product[]>(`${this.baseUrl}?_limit=8`)
        .get<product[]>(`${this.baseUrlProducts}`)
        .pipe(catchError(this.handleError))
    );
  }

  // Search products based on a query object
  searchProducts(query: { [key: string]: any }): Observable<product[]> {
    let params = new HttpParams();
    for (const key in query) {
      // console.warn('key->' + key);
      if (query[key]) {
        params = params.append(key, query[key]);
        // console.warn('params->' + params);
      }
    }

    return this.http
      .get<product[]>(`${this.baseUrlProducts}?${params}`)
      .pipe(catchError(this.handleError));
  }


  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
