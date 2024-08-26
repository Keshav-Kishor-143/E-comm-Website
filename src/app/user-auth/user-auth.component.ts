import { ProductsService } from './../services/products.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { cart, login, product, signUp } from '../data-type';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css',
})
export class UserAuthComponent {
  showLogin: boolean = false;
  loginError: string = '';
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.userService.reloadUser();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.signUp(form.value);
  }

  onLoginSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.login(form.value);
  }

  signUp(data: signUp) {
    this.userService.userSignUp(data);
  }


  login(data: login) {
    this.userService.userLogin(data).subscribe(
      (result: any) => {
        if (result && result.status === 200 && result.body && result.body.length > 0) {
          const user = result.body[0];
          if (user.password === data.password) {
            this.localCartToRemoteCart();
            this.userService.isUserLoggedIn.next(true);
            this.localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['home']);
          } else {
            this.loginError = 'Incorrect password';
          }
        } else {
          this.loginError = 'Email not found';
        }
        // console.warn('result =>', result);
      },
      (error) => {
        // console.error('Login failed', error);
        this.loginError = error;
      }
    );
  }

  openLogin() {
    this.showLogin = true;
    this.loginError = ''; // Reset error message
  }

  openSignUp() {
    this.showLogin = false;
    this.loginError = ''; // Reset error message
  }

  localCartToRemoteCart(){
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId= user && JSON.parse(user).id;
    if(data){
     let cartDataList:product[]= JSON.parse(data);

     cartDataList.forEach((product:product, index)=>{
       let cartData:cart={
         ...product,
         productId:product.id,
         userId
       }
       delete cartData.id;
       setTimeout(() => {
         this.cartService.addToCartDatabase(cartData).subscribe((result)=>{
           if(result){
             console.warn("data is stored in DB");
           }
         })
       }, 500);
       if(cartDataList.length===index+1){
         localStorage.removeItem('localCart')
       }
     })
    }

    setTimeout(() => {
     this.cartService.getCartItemsBasedOnId(userId)
    }, 2000);

   }

  resetLoginError() {
    this.loginError = ''; // Clear login error when fields change
  }
}
