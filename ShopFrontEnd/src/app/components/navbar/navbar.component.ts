import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { UserDto } from 'src/app/models/user.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

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

interface Product {
  id: number;
  productType: number;
  name: string;
  image: string;
  additionalValue: number;
  goldWeightInGrams: number;
  sellingPrice: number;
  categoryId: number;
  description: string;
  stockQuantity: number;
  productState: number;
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
  
  
  constructor(
    private router: Router,
    private http: HttpClient,
    public authService: AuthService,
    private cartService: CartService
  ) {}
  ngOnDestroy(): void {
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }
  
  ngOnInit(): void {
    this.updateCartCount();
    // Modified event listener for document clicks
    document.addEventListener('mousedown', (event) => {
      // Only close if the click is outside the search container element
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
  updateCartCount(): void {
    if (this.currentUser) {
      const userId = this.currentUser.id; // Assuming user ID is accessible
      this.http.get<any>(`https://localhost:7041/Cart/GetCartItemCount/${userId}`).subscribe(
        response => {
          if (response.isSuccess && response.result !== undefined) {
            this.cartItemCount = response.result;
          } else {
            this.cartItemCount = null;
          }
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
    
    // Focus the input field when opening the search
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
    
    
    const url = `https://localhost:7041/Product/GetByName?name=${encodeURIComponent(this.searchTerm)}&page=1`;
    
    this.http.get<SearchResponse>(url).subscribe(
      response => {
        if (response.isSuccess && response.result) {
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