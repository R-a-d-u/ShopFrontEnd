import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
export class NavbarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  isSearchOpen = false;
  searchTerm = '';
  searchResults: Product[] = [];
  
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    // Modified event listener for document clicks
    document.addEventListener('mousedown', (event) => {
      // Only close if the click is outside the search container element
      const searchContainerEl = document.querySelector('.search-container');
      if (searchContainerEl && !searchContainerEl.contains(event.target as Node)) {
        this.isSearchOpen = false;
        this.clearSearchResults();
      }
    });
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