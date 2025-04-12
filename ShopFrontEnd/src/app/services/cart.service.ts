// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  isSuccess: boolean;
  result: T;
  errorMessage: string | null;
}

export interface Product {
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

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}`;
  private cartItemCountSource = new BehaviorSubject<number>(0); // BehaviorSubject for cart count
  cartItemCount$ = this.cartItemCountSource.asObservable(); // Observable to subscribe to cart count

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get cart ID for the current user
  getCartByUserId(): Observable<number> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/Cart/GetCartId/${userId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get cart');
        })
      );
  }

  // Get all items in a cart
  getCartItems(cartId: number): Observable<CartItem[]> {
    return this.http.get<ApiResponse<CartItem[]>>(`${this.apiUrl}/Cart/GetAllItems/${cartId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get cart items');
        }),
        catchError((error: HttpErrorResponse) => {
          // Check if this is the specific empty cart error
          if (error.status === 404 && error.error && error.error.errorMessage === "Cart is empty.") {
            // Return an empty array instead of throwing an error for empty carts
            return of([]);
          }
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get cart items'));
        })
      );
  }

  // Add item to cart
  addToCart(productId: number,cartId: number, quantity: number = 1): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Cart/AddItem`, {
      productId,
      cartId,
      quantity
    }).pipe(
      map(response => {
        if (response && response.isSuccess) {
          this.updateCartCount(cartId);
          return response.result;
        }
        throw new Error(response.errorMessage || 'Failed to add item to cart');
      })
    );
  }

  // Update cart item quantity
  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    console.log(cartItemId,quantity,1)
    // Fetch the cartId associated with the user
    return this.getCartByUserId().pipe(
      switchMap(cartId => {
        console.log('Payload:', { cartItemId, quantity });
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/CartItem/UpdateQuantity`, {
          cartItemId,
          quantity
        }).pipe(
          map(response => {
            if (response && response.isSuccess) {
              console.log(response)
              console.log(cartItemId,quantity,1)
              this.updateCartCount(cartId); // Update the cart count after quantity update
              return response.result;
            }
            throw new Error(response.errorMessage || 'Failed to update cart item');
          })
        );
      })
    );
  }
  

  // Remove item from cart
  removeFromCart(cartItemId: number): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
  
    // Fetch the cartId associated with the user
    return this.getCartByUserId().pipe(
      switchMap(cartId => {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/Cart/RemoveItem/${cartItemId}`).pipe(
          map(response => {
            if (response && response.isSuccess) {
              this.updateCartCount(cartId); // Update the cart count after removal
              return response.result;
            }
            throw new Error(response.errorMessage || 'Failed to remove item from cart');
          })
        );
      })
    );
  }
  
  getShippingPrice(cartId: number): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/Cart/GetShippingPrice/${cartId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get shipping price');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get shipping price'));
        })
      );
  }
  
  // Get total price including shipping for a cart
  getCartTotal(cartId: number): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/Cart/GetTotal/${cartId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get cart total');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get cart total'));
        })
      );
  }
  private updateCartCount(cartId: number): void {
    this.getCartItems(cartId).subscribe(
      (items) => {
        const itemCount = items.reduce((total, item) => total + item.quantity, 0); // Sum up item quantities
        this.cartItemCountSource.next(itemCount); // Emit updated count
      },
      (error) => {
        console.error('Failed to fetch cart items for count update', error);
        this.cartItemCountSource.next(0); // Fallback to 0 if error occurs
      }
    );
  }
  getCartItemCount(cartId: number): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/Cart/GetCartItemCount/${cartId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get cart item count');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get cart item count'));
        })
      );
  }
  clearCart(cartId: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/Cart/Clear/${cartId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            this.cartItemCountSource.next(0); // Reset cart count
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to clear cart');
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to clear cart'));
        })
      );
  }

}