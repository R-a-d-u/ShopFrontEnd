// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = false;
  error = '';
  subtotalPrice = 0;
  shippingPrice = 0;
  totalPrice = 0;
  
  // To store cart ID for API calls
  cartId: number | null = null;
  
  // States to handle specific error cases
  cartNotFound = false;
  cartEmpty = true;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Please log in to view your cart';
      return;
    }

    this.loading = true;
    this.error = '';
    this.cartNotFound = false;
    this.cartEmpty = false;
    
    this.cartService.getCartByUserId().subscribe({
      next: (cartId) => {
        this.cartId = cartId;
        this.cartService.getCartItems(cartId).subscribe({
          next: (items) => {
            this.cartItems = items;
            this.cartEmpty = items.length === 0;
            
            if (!this.cartEmpty) {
              this.loadCartPricing(cartId); // Load shipping and total from API
            } else {
              this.loading = false;
            }
          },
          error: (error) => {
            this.loading = false;
            if (error.message === "Cart is empty.") {
              this.cartEmpty = true;
            } else {
              this.error = error.message || 'Failed to load cart items';
            }
          }
        });
      },
      error: (error) => {
        this.loading = false;
        if (error.message === "No cart found for this user.") {
          this.cartNotFound = true;
        } else {
          this.error = error.message || 'Failed to load cart';
        }
      }
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1 || !this.cartId) return;
    
    this.loading = true;
    this.cartService.updateCartItemQuantity(item.id, quantity).subscribe({
      next: () => {
        // Update the UI with new quantity
        item.quantity = quantity;
        
        // Get updated pricing from API after quantity change
        if (this.cartId) {
          this.loadCartPricing(this.cartId);
          // Reload cart items to get updated prices
          this.cartService.getCartItems(this.cartId).subscribe({
            next: (items) => {
              this.cartItems = items;
            },
            error: (error) => {
              this.error = error.message || 'Failed to reload cart items';
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = error.message || 'Failed to update quantity';
        this.loading = false;
        this.loadCartItems(); // Reload the cart if update fails
      }
    });
  }

  removeItem(itemId: number): void {
    if (!this.cartId) return;
    
    this.loading = true;
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        
        if (this.cartItems.length === 0) {
          this.cartEmpty = true;
          this.subtotalPrice = 0;
          this.shippingPrice = 0;
          this.totalPrice = 0;
          this.loading = false;
        } else if (this.cartId) {
          this.loadCartPricing(this.cartId);
        }
      },
      error: (error) => {
        this.error = error.message || 'Failed to remove item';
        this.loading = false;
      }
    });
  }

  loadCartPricing(cartId: number): void {
    // Use forkJoin to make both API calls in parallel
    forkJoin({
      shipping: this.cartService.getShippingPrice(cartId).pipe(
        catchError(error => {
          this.error = error.message || 'Failed to get shipping price';
          return of(0); // Default to 0 if error
        })
      ),
      total: this.cartService.getCartTotal(cartId).pipe(
        catchError(error => {
          this.error = error.message || 'Failed to get cart total';
          return of(0); // Default to 0 if error
        })
      )
    }).subscribe({
      next: (results) => {
        this.shippingPrice = results.shipping;
        this.totalPrice = results.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}