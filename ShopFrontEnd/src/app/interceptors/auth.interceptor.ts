// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get current user
    const currentUser = this.authService.currentUserValue;
    
    // If we have a user, add auth headers
    if (currentUser) {
      request = this.addAuthenticationHeader(request, currentUser.id.toString());
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token expired or invalid - logout and redirect to login
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthenticationHeader(request: HttpRequest<any>, userId: string): HttpRequest<any> {
    // Use a standard header format - customize according to your backend requirements
    return request.clone({
      setHeaders: {
        'X-User-Id': userId
      }
    });
    
    // For JWT token approach, you would do something like:
    // return request.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });
  }
}