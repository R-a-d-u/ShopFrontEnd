// src/app/pages/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

export enum ProductType {
  Jewelry = 1,
  GoldCoins = 2,
  GoldBars = 3,
  Other = 4,
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
  addingToCart = false;
  cartId: number = -1;
  imageLoadFailed = false;
  currentUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {  this.currentUrl = this.router.url;}

  ngOnInit(): void {
    this.loading = true;
    if (this.authService.isAuthenticated()) {
      this.cartService.getCartByUserId().subscribe(cartId => {
        this.cartId = cartId;
      });
    }
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
    if (this.currentUrl.startsWith('/admin/inventory')) {
      this.router.navigate(['/admin/inventory']);
    } else if (this.currentUrl.startsWith('/admin/product')) {
      this.router.navigate(['/admin/product']);
    } else if (this.product?.categoryId) {
      this.router.navigate(['/category', this.product.categoryId]);
    }
  }
  

  getProductTypeName(productType: number): string {
    if (productType > 3)
      return 'Item';
    return ProductType[productType] || 'Item';
  }

  getCategoryNameById(): string {
    const categoryNames: { [key: number]: string } = {
      1: 'jewelry',
      2: 'gold coins',
      3: 'gold bars',
      4: 'products'
    };
    if (this.currentUrl.startsWith('/admin/inventory')) {
      return 'Inventory Management';
    } else if (this.currentUrl.startsWith('/admin/product')) {
      return 'Product Management';
    } else {
      return this.product?.productType ? categoryNames[this.product.productType] || '' : '';
    }
  }
  addToCart(): void {
    if (!this.product || !this.quantity || this.quantity <= 0) {
      return;
    }
    
    // Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      // Redirect to login page
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      this.messageService.add({
        severity: 'info',
        detail: 'Please log in to add items to your cart',
        life: 3000
      });
      return;
    }
  
    this.addingToCart = true;
  
    this.cartService.addToCart(this.product.id, this.cartId, this.quantity)
      .subscribe({
        next: (result) => {
          this.addingToCart = false;
          this.messageService.add({
            severity: 'warn',
            detail: 'Product added to cart.',
            life: 1200
          });
        },
        error: (err) => {
          this.addingToCart = false;
          this.error = err.message || 'Failed to add product to cart';
          this.messageService.add({
            severity: 'danger',
            detail: 'Cart quantity exceeds available stock.',
            life: 1500
          });
        }
      });
  }
  onImageError(): void {
    this.imageLoadFailed = true;
  }
}
