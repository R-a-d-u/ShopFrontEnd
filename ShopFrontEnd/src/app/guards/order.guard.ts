// Updated auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
   
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }
    
   
    if (this.authService.isAdmin()) {
      return true;
    }
    
   
    const orderId = route.params['id'];
    const currentUser = this.authService.currentUserValue;
    
    if (!orderId || !currentUser) {
      return this.router.createUrlTree(['/unauthorized']);
    }
    
    return this.orderService.getOrderById(orderId).pipe(
      map(order => {
      
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
}