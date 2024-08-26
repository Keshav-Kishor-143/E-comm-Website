import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { cart, product } from '../data-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productData: undefined | product;
  quantity: number = 1;
  removeCart = false;
  cartData: product | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private cartsService: CartService
  ) {}

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('id');
    // console.warn("init-->",productId);
    productId &&
      this.productsService
        .getProductBasedOnId(productId)
        .subscribe((result) => {
          this.productData = result;
          let cartData = localStorage.getItem('localCart');
          if (productId && cartData) {
            let items = JSON.parse(cartData);
            items = items.filter(
              (item: product) => productId === item.productId?.toString()
            );
            if (items.length) {
              this.removeCart = true;
            } else {
              this.removeCart = false;
            }
          }

          let user = localStorage.getItem('user');
          if (user) {
            let userId = user && JSON.parse(user).id;
            this.cartsService.getCartItemsBasedOnId(userId);

            this.cartsService.totalCartData.subscribe((result) => {
              let item = result.filter(
                (item: product) => productId?.toString() === item.id?.toString()
              );
              if (item.length) {
                this.cartData = item[0];
                this.removeCart = true;
              }
            });
          }
        });
  }

  increaseQuantity(): void {
    if (this.quantity < 20) this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.quantity;
      if (!localStorage.getItem('user')) {
        this.cartsService.cartDataToLocalStorage(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId,
        };
        delete cartData.id;
        console.warn('User logged in --->', userId);
        console.warn('Cart data--->', cartData);
        this.cartsService.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.cartsService.getCartItemsBasedOnId(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeFromCart(productId: string) {
    if (!localStorage.getItem('user')) {
      this.cartsService.removeCartItemFromLocalStorage(productId);
    } else {
      console.warn('cartData', this.cartData);
      this.cartData &&
        this.cartsService
          .removeCartItemFromDatabase(this.cartData.id)
          .subscribe((result) => {
            let user = localStorage.getItem('user');
            let userId = user && JSON.parse(user).id;
            this.cartsService.getCartItemsBasedOnId(userId);
          });
    }
    this.removeCart = false;
  }
}
