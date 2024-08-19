import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductsService } from '../services/products.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css',
})
export class SellerAddProductComponent implements OnInit {
  addSuccessful: string | undefined;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.addProductFunc(form);
  }

  addProductFunc(form: NgForm) {
    const data = form.value;

    // Ensure that price is stored as a formatted string (with commas)
    if (data.price) {
      data.price = this.addCommasToNumber(data.price.replace(/,/g, ''));
    }

    this.productsService.addProduct(data).subscribe((result) => {
      if (result) {
        this.addSuccessful = 'Product added successfully';
        this.snackBar.open(this.addSuccessful, 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/seller-home']);
      }
      setTimeout(() => (this.addSuccessful = undefined), 3000);
    });
  }

  formatPrice(event: any) {
    let value = event.target.value.replace(/,/g, ''); // Remove existing commas
    value = this.addCommasToNumber(value);
    event.target.value = value;
  }

  addCommasToNumber(value: string): string {
    let x = value.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';

    // Apply Indian number system comma formatting
    const lastThree = x1.slice(-3);
    const otherNumbers = x1.slice(0, -3);

    if (otherNumbers !== '') {
      x1 = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      x1 = lastThree;
    }

    return x1 + x2;
  }
}
