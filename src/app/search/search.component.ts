import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, CommonModule,RouterLink,RouterOutlet],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'], // Corrected from 'styleUrl' to 'styleUrls'
})
export class SearchComponent implements OnInit {
  searchResult: undefined | product[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    let query = this.activatedRoute.snapshot.paramMap.get('query');
    // console.warn('query in ts->', query);
    if (query) {
      this.searchProductMethod(query);
    } else {
      this.searchResult = [];
    }
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  searchProductMethod(query: string) {
    // Ensure the method expects a string
    let searchText = query.trim();

    if (searchText) {
      // Capitalize the first letter of the search text
      searchText = this.capitalizeFirstLetter(searchText);

      let searchQuery: { [key: string]: any } = {};

      // Determine if the search text is numeric, then it's a price value
      if (!isNaN(+searchText)) {
        searchQuery['price'] = searchText;
      } else if (searchText.includes(' ')) {
        // If the text has spaces, assuming it's product name
        searchQuery['name'] = searchText;
      } else {
        // Default search will be category
        searchQuery['category'] = searchText;
      }

      this.productService.searchProducts(searchQuery).subscribe((result) => {
        // console.warn(result);
        // Handle the search result here
        this.searchResult = result;
      });
    } else {
      this.searchResult = [];
    }
  }
}
