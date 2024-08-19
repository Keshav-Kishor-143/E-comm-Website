import { Component, NgModule, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { product } from '../data-type';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seller-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterOutlet],
  templateUrl: './seller-home-page.component.html',
  styleUrl: './seller-home-page.component.css',
})
export class SellerHomePageComponent implements OnInit {
  productList: undefined | product[];
  deleteMsg: string | undefined;
  constructor(
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.fetchProductList();
  }
  fetchProductList() {
    this.productsService.getProductList().subscribe((result) => {
      // console.warn('Fetched List-->', result);
      this.productList = result;
    });
  }
  deleteProduct(id: any) {
    // console.warn("Product delete request for id - ",id)
    this.productsService.deleteProductBasedOnId(id).subscribe((result) => {
      if (result) {
        this.deleteMsg = 'Product deleted successfully!';
        this.snackBar.open(this.deleteMsg, 'Close', {
          duration: 3000,
        });
        this.fetchProductList();
      }
      setTimeout(() => (this.deleteMsg = undefined), 3000);
    });
  }
}
