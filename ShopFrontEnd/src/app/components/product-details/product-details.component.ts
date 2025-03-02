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

  goBack(): void {
    if(this.product?.categoryId==1)
    this.router.navigate(['/jewelry']);
    if(this.product?.categoryId==2)
    this.router.navigate(['/gold-coins']);
    if(this.product?.categoryId==3)
    this.router.navigate(['/gold-bars']);
  }
  getProductTypeName(productType: number): string {
    return ProductType[productType] || 'Unknown';
  }
  getCategoryNameById(): string
  {
    if(this.product?.categoryId==1)
      return "jewlery";
      if(this.product?.categoryId==2)
        return "gold coins";
      if(this.product?.categoryId==3)
        return "gold bars";
      return "";
  }
}
