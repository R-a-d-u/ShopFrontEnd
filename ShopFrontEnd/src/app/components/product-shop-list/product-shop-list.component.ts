// product-shop-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService, Product, PagedResult } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-product-shop-list',
  templateUrl: './product-shop-list.component.html',
  styleUrls: ['./product-shop-list.component.css']
})
export class ProductShopListComponent implements OnInit {
 products: Product[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 0;
  totalCount = 0;
  categoryId: number = 0;
  imageLoadFailedMap: { [productId: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id']; // Convert string to number
      if (isNaN(this.categoryId)) {
        // Handle invalid category ID (perhaps set a default or show an error)
        this.error = 'Invalid category ID';
        return;
      }
      this.loadProducts(this.categoryId, 1, 4);
    });
  }
  onImageError(productId: number): void {
    this.imageLoadFailedMap[productId] = true;
  }

  loadProducts(categoryId :number,page: number = 1, pageSize: number = 4): void {
    this.loading = true;
    this.currentPage = page;
  
    this.productService.getAllProductsByCategoryId(categoryId, page, pageSize).subscribe({
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
    this.loadProducts(this.categoryId,page);
  }
}