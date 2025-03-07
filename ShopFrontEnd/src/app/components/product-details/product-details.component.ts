// src/app/pages/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export enum ProductType {
  Jewelry = 1,
  GoldCoins = 2,
  GoldBars = 3
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  quantity: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (isNaN(id)) {
          this.error = 'Invalid product ID';
          return of(null);
        }
        return this.productService.getProductById(id);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.isSuccess && response.result) {
          this.product = response.result;

          // Set initial quantity based on stock availability
          this.quantity = this.product.stockQuantity > 0 ? 1 : null;
        } else if (response) {
          this.error = response.errorMessage || 'Failed to fetch product details';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.errorMessage || 'An error occurred while fetching product details';
        this.loading = false;
      }
    });
  }

  decreaseQuantity() {
    if (this.quantity && this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    if (this.product && this.quantity !== null && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  goBack(): void {
    const categoryRoutes: { [key: number]: string } = {
      1: '/jewelry',
      2: '/gold-coins',
      3: '/gold-bars'
    };

    if (this.product?.categoryId && categoryRoutes[this.product.categoryId]) {
      this.router.navigate([categoryRoutes[this.product.categoryId]]);
    } else {
      this.router.navigate(['/']); // Default fallback
    }
  }

  getProductTypeName(productType: number): string {
    return ProductType[productType] || 'Unknown';
  }

  getCategoryNameById(): string {
    const categoryNames: { [key: number]: string } = {
      1: 'jewelry',
      2: 'gold coins',
      3: 'gold bars'
    };

    return this.product?.categoryId ? categoryNames[this.product.categoryId] || '' : '';
  }
}
