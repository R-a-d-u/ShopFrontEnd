// product-list.component.ts
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
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
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
    { label: 'All Discontinued', value: 'discontinued' },
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
      case 'discontinued':
        this.loadDiscontinuedProducts();
        break;
      case 'category':
        this.loadProductsByCategory();
        break;
      case 'name':
        this.loadProductsByName();
        break;
      default:
        this.loadProductsByCategory();
    }
  }

  loadDiscontinuedProducts(): void {
    this.productService.getAllDiscontinuedProducts(this.currentPage, this.pageSize)
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
    this.router.navigate(['/product-details', productId]);
  }

  editProductInfo(productId: number): void {
    this.router.navigate(['/admin/product/edit-info/', productId]);
  }

  editProductPrice(productId: number): void {
    this.router.navigate(['/admin/product/edit-price/', productId]);
  }

 setDiscontinued(productId: number): void {
    this.confirmationService.confirm({
      message: 'The product will be removed from the customer store page?',
      accept: () => {
        this.productService.setProductDiscontinued(productId).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Success',
                detail: 'Product marked as Discontinued'
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

  addNewProduct(): void {
    this.router.navigate(['/admin/product/add']);
  }

  // Helper methods
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
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }
  goBack() : void{
    this.router.navigate(['/admin']);
  }
}