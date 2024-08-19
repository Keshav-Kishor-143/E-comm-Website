import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css',
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | product;
  updateSuccessfulMsg: string | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('id'); // to fetch the id from the url
    if (productId != null) {
      this.productService.getProductBasedOnId(productId).subscribe((data) => {
        this.productData = data;

        // Format the price with commas before displaying it in the form
        if (this.productData && this.productData.price) {
          this.productData.price = this.addCommasToNumber(
            this.productData.price.replace(/,/g, '')
          );
        }
      });
    }
  }

  onUpdate(data: product) {
    if (this.productData?.id) {
      data.id = this.productData.id;
    }

    // Ensure the price is correctly formatted before sending it to the API
    if (data.price) {
      data.price = this.addCommasToNumber(data.price.replace(/,/g, ''));
    }

    this.productService.updateProductBasedOnId(data).subscribe((result) => {
      if (result) {
        this.updateSuccessfulMsg = 'Product details updated.';
        this.snackBar.open(this.updateSuccessfulMsg, 'Close', {
          duration: 3000,
        });

        this.router.navigate(['/seller-home']);
      }
      setTimeout(() => {
        this.updateSuccessfulMsg = undefined;
      }, 3000);
    });
  }

  formatPrice(event: any) {
    let value = event.target.value.replace(/,/g, ''); // Remove existing commas
    value = this.addCommasToNumber(value);
    event.target.value = value;
  }

  addCommasToNumber(value: string): string {
    // Remove any existing commas first to prevent double commas
    let cleanedValue = value.replace(/,/g, '');
    let x = cleanedValue.split('.');
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
