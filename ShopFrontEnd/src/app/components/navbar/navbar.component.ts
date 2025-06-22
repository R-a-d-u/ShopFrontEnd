import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { UserDto } from 'src/app/models/user.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Product } from 'src/app/services/product.service'; // Import the Product interface

interface SearchResponse {
  isSuccess: boolean;
  result: {
    items: Product[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  errorMessage: string | null;
}
interface CategoryDto {
  id: number;
  name: string;
  lastModifiedDate: string;
}



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  private cartCountSubscription: Subscription | null = null; 

  isMenuOpen = false;
  currentUser: UserDto | null = null;
  isSearchOpen = false;
  searchTerm = '';
  searchResults: Product[] = [];
  isDropdownOpen=false;
  cartItemCount: number | null = null;
  categories: CategoryDto[] = [];
  imageLoadFailedMap: { [productId: number]: boolean } = {};
  
  
  constructor(
    private router: Router,
    private http: HttpClient,
    public authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}
  ngOnDestroy(): void {
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }
  
  ngOnInit(): void {
    this.updateCartCount();
    this.loadCategories();
    document.addEventListener('mousedown', (event) => {
      const searchContainerEl = document.querySelector('.search-container');
      if (searchContainerEl && !searchContainerEl.contains(event.target as Node)) {
        this.isSearchOpen = false;
        this.clearSearchResults();
      }
    });
    this.cartCountSubscription = this.cartService.cartItemCount$.subscribe(
      (count) => {
        this.cartItemCount = count;
      }
    );
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateCartCount();
    });
    this.authService.autoLogin();
  }
  onImageError(productId: number): void {
    this.imageLoadFailedMap[productId] = true;
  }
  loadCategories(): void {
    this.categoryService.getAllCategoryNames().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error loading categories:', error);
      }
    );
  }
  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/category', categoryId]);
  }
  updateCartCount(): void {
    if (this.currentUser) {
      const userId = this.currentUser.id;
      this.cartService.getCartItemCount(userId).subscribe(
        count => {
          this.cartItemCount = count;
        },
        error => {
          console.error('Error fetching cart count:', error);
          this.cartItemCount = null;
        }
      );
    } else {
      this.cartItemCount = null;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  logout(): void {
    this.authService.logout();
  }
  toggleSearch(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.isSearchOpen) {
      this.clearSearchResults();
    }
    this.isSearchOpen = !this.isSearchOpen;
    
    if (this.isSearchOpen) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0);
    }
  }
  clearSearchResults(): void {
    this.searchResults = [];
    this.searchTerm = '';
  }
  keepDropdownOpen(event: Event): void {
    event.stopPropagation();
  }
  closeMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }
  
  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
    
    this.productService.getProductsByName(this.searchTerm).subscribe(
      response => {
        if (response && response.isSuccess && response.result) {
          this.searchResults = response.result.items;
        } else {
          this.searchResults = [];
        }
      },
      error => {
        console.error('Error searching products:', error);
        this.searchResults = [];
      }
    );
  }
  
  navigateToProduct(productId: number): void {
    this.router.navigate(['/product-details', productId]);
    this.isSearchOpen = false;
    this.clearSearchResults();
  }
}