import { routes } from './../app.routes';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SellerService } from '../services/seller.service';
import { Router, RouterModule } from '@angular/router';
import { login, signUp } from '../data-type';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './seller-auth.component.html',
  styleUrl: './seller-auth.component.css',
})
export class SellerAuthComponent implements OnInit {
  showLogin: boolean = false;
  loginError: string = '';

  constructor(private seller: SellerService, private router: Router, private localStorage:LocalStorageService) {}

  ngOnInit(): void {
    this.seller.reloadSeller();
    this.seller.isSellerLoggedIn.subscribe((isLoggedIn) => {
      // console.log('Is Seller Logged In:', isLoggedIn);
    });
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
    this.seller.userSignUp(data);
  }

  login(data: login) {
    this.seller.userLogin(data).subscribe(
      (result: any) => {
        if (result && result.status === 200 && result.body && result.body.length > 0) {
          const seller = result.body[0];
          if (seller.password === data.password) {
            this.seller.isSellerLoggedIn.next(true);
            this.localStorage.setItem('seller', JSON.stringify(seller));
            this.router.navigate(['seller-home']);
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
        this.loginError = 'Login failed due to server error';
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

  resetLoginError() {
    this.loginError = ''; // Clear login error when fields change
  }
}
