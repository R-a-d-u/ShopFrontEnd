import { Component, OnInit } from '@angular/core';
import { ProductService, Product, PagedResult, ResponseValidator } from '../../services/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryDto } from '../../models/category.model';

interface SearchOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-product-stock-list',
  templateUrl: './product-stock-list.component.html',
  styleUrls: ['./product-stock-list.component.css']
})
export class ProductStockListComponent {
 products: Product[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Search and filter options
  searchOptions: SearchOption[] = [
    { label: 'By Category', value: 'category' },
    { label: 'By Name', value: 'name' }
  ];
  selectedSearchOption: string = 'category';
  searchName: string = '';
  selectedCategoryId: number = 1;
  
  // List of categories (would typically be fetched from a service)
  categories: CategoryDto[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }
  loadCategories(): void {
    this.categoryService.getAllCategoryNames().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.categories.length > 0) {
          this.selectedCategoryId = this.categories[0].id;
        }
      },
      error: (error) => {
        // Use API's error message if available
        const errorMsg = error.error?.errorMessage || error.message || 'Failed to load categories';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg
        });
      }
    });
  }
  loadProducts(): void {
    this.loading = true;
    this.errorMessage = null;
    
    switch (this.selectedSearchOption) {
      case 'category':
        this.loadProductsByCategory();
        break;
      case 'name':
        this.loadProductsByName();
        break;
    }
  }
  loadProductsByCategory(): void {
    this.productService.getAllProductsByCategoryId(this.selectedCategoryId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response.isSuccess && response.result) {
            this.products = response.result.items;
            this.totalItems = response.result.totalItems;
            this.totalPages = response.result.totalPages;
            this.currentPage = response.result.pageNumber;
            this.pageSize = response.result.pageSize;
          } else {
            // Use API's error message
            this.errorMessage = response.errorMessage || 'Unknown error occurred';
          }
          this.loading = false;
        },
        error: (error) => {
          // Use API's error message if available
          this.errorMessage = error.error?.errorMessage || error.message || 'Error loading products';
          this.loading = false;
        }
      });
  }


  loadProductsByName(): void {
    if (!this.searchName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a search term'
      });
      this.loading = false;
      return;
    }
    
    this.productService.getProductsByName(this.searchName, this.currentPage, this.pageSize)
    .subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.products = response.result.items;
          this.totalItems = response.result.totalItems;
          this.totalPages = response.result.totalPages;
          this.currentPage = response.result.pageNumber;
          this.pageSize = response.result.pageSize;
        } else {
          // Use API's error message
          this.errorMessage = response.errorMessage || 'Unknown error occurred';
        }
        this.loading = false;
      },
      error: (error) => {
        // Use API's error message if available
        this.errorMessage = error.error?.errorMessage || error.message || 'Error loading products';
        this.loading = false;
      }
    });
}

  onSearchOptionChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadProducts();
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page
    this.loadProducts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  // Action methods
  viewProductDetails(productId: number): void {
    console.log('View product details:', productId);
    // this.router.navigate(['/products', productId]);
  }

  editProductStock(productId: number): void {
    console.log('Edit product stock:', productId);
    // this.router.navigate(['/products/edit-stock', productId]);
  }

  setInStock(productId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to set this product as In Stock?',
      accept: () => {
        this.productService.setProductInStock(productId).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product set to In Stock'
              });
              this.loadProducts(); // Reload products after status change
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.errorMessage || 'Unknown error occurred'
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.errorMessage || error.message || 'Failed to update product status'
            });
          }
        });
      }
    });
  }

  setOutOfStock(productId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to set this product as Out of Stock?',
      accept: () => {
        this.productService.setProductOutOfStock(productId).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product set to Out of Stock'
              });
              this.loadProducts(); // Reload products after status change
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.errorMessage || 'Unknown error occurred'
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.errorMessage || error.message || 'Failed to update product status'
            });
          }
        });
      }
    });
  }

  getProductTypeName(typeId: number): string {
    switch (typeId) {
      case 1: return 'Jewelry';
      case 2: return 'Gold Coin';
      case 3: return 'Gold Bar';
      default: return 'Unknown';
    }
  }

  getProductStateName(stateId: number): string {
    switch (stateId) {
      case 1: return 'In Stock';
      case 2: return 'Out of Stock';
      case 3: return 'Discontinued';
      default: return 'Unknown';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  goBack() : void{
    this.router.navigate(['/admin']);
  }
}

