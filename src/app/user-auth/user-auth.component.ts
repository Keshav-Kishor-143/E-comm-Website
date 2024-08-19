import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent {
  showLogin: boolean = false;
  loginError: string = '';
  constructor( private router: Router, private localStorage:LocalStorageService) {}

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    // this.signUp(form.value);
  }

  onLoginSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    // this.login(form.value);
  }

  // signUp(data: signUp) {
  // }

  // login(data: login) {
  //   this.seller.userLogin(data).subscribe(
  //     (result: any) => {
  //       if (result && result.status === 200 && result.body && result.body.length > 0) {
  //         const seller = result.body[0];
  //         if (seller.password === data.password) {
  //           this.seller.isSellerLoggedIn.next(true);
  //           this.localStorage.setItem('seller', JSON.stringify(seller));
  //           this.router.navigate(['seller-home']);
  //         } else {
  //           this.loginError = 'Incorrect password';
  //         }
  //       } else {
  //         this.loginError = 'Email not found';
  //       }
  //       // console.warn('result =>', result);
  //     },
  //     (error) => {
  //       // console.error('Login failed', error);
  //       this.loginError = 'Login failed due to server error';
  //     }
  //   );
  // }

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
