// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private orderService: OrderService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }
    
    // Check for role-based access if specified in route data
    if (route.data['roles']) {
      const roles = route.data['roles'] as string[];
      
      if (roles.includes('admin') && !this.authService.isAdmin()) {
        return this.router.createUrlTree(['/unauthorized']);
      }
      
      if (roles.includes('employee') && !this.authService.isEmployee()) {
        return this.router.createUrlTree(['/unauthorized']);
      }
      
      if (roles.includes('customer') && !this.authService.isCustomer()) {
        return this.router.createUrlTree(['/unauthorized']);
      }
    }
    
    // Check for order access if this is an order detail route
    if (state.url.includes('/orders/') && route.params['id']) {
      const orderId = route.params['id'];
      const currentUser = this.authService.currentUserValue;
      
      // Admin users can access any order
      if (this.authService.isAdmin()) {
        return true;
      }
      
      // For regular users, check if the order belongs to them
      return this.orderService.getOrderById(orderId).pipe(
        map(order => {
          if(currentUser)
          if (order && order.userId === currentUser.id) {
            return true;
          }
          return this.router.createUrlTree(['/unauthorized']);
        }),
        catchError(() => {
          return of(this.router.createUrlTree(['/unauthorized']));
        })
      );
    }
    
    return true;
  }
}