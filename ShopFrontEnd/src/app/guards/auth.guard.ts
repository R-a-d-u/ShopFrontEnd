// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
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
    
    return true;
  }
}