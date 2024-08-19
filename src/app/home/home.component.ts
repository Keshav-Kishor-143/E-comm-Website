import { Component, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../services/products.service';
import { product } from '../data-type';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbCarouselModule,CommonModule,RouterOutlet,RouterModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  popularProductsData:undefined|product[]
  trendyProductsData:undefined|product[]
  constructor(private productsService: ProductsService,private route:Router) {}
  ngOnInit(): void {
    this.productsService.popularProducts().subscribe((result) => {
      this.popularProductsData = result
    });
    this.productsService.getTrendyProducts().subscribe((result) => {
      this.trendyProductsData = result
    });
  }
}
