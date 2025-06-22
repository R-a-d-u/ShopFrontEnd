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
    
   
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }
    

    if (route.data['roles']) {
      const requiredRoles = route.data['roles'] as string[];
      let hasRequiredRole = false;
      
     
      if (requiredRoles.includes('admin') && this.authService.isAdmin()) {
        hasRequiredRole = true;
      }
      
      if (requiredRoles.includes('employee') && this.authService.isEmployee()) {
        hasRequiredRole = true;
      }
      
      if (requiredRoles.includes('customer') && this.authService.isCustomer()) {
        hasRequiredRole = true;
      }
      
     
      if (!hasRequiredRole) {
        return this.router.createUrlTree(['/unauthorized']);
      }
    }
    
   
    if (state.url.includes('/orders/') && route.params['id']) {
      const orderId = route.params['id'];
      const currentUser = this.authService.currentUserValue;
      
    
      if (this.authService.isAdmin()) {
        return true;
      }
      
   
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