import { Component, OnInit } from '@angular/core';
import { ProductService, Product, PagedResult } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gold-bars',
  templateUrl: './gold-bars.component.html',
  styleUrls: ['./gold-bars.component.css']
})
export class GoldBarsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 0;
  totalCount = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;

    this.productService.getAllProductsByCategoryId(3, page).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.products = response.result.items;
          this.totalPages = response.result.totalPages;
          this.totalCount = response.result.totalItems; 
          this.currentPage = response.result.pageNumber;
        } else {
          this.error = response.errorMessage || 'Failed to fetch products';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.errorMessage || 'An error occurred while fetching products';
        this.loading = false;
      }
    });
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  changePage(page: number): void {
    this.loadProducts(page);
  }
}
