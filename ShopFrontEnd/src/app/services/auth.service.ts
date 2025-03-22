// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDto } from '../models/user.model';
import { environment } from '../../enviroments/environment';

interface ApiResponse<T> {
  isSuccess: boolean;
  result: T;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/User`; // Update with your actual API URL
  private currentUserSubject: BehaviorSubject<UserDto | null>;
  public currentUser$: Observable<UserDto | null>;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserDto | null>(this.getUserFromLocalStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Get the current user value without subscribing
  public get currentUserValue(): UserDto | null {
    return this.currentUserSubject.value;
  }
  register(name: string, email: string, password: string, phoneNumber: string, userAccessType: number): Observable<UserDto> {
    const userPayload = {
      name,
      email,
      password,
      phoneNumber,
      userAccessType, // Assuming '1' represents a customer
      lastModifyDate: new Date().toISOString(),
      isDeleted: false
    };
  
    return this.http.post<ApiResponse<UserDto>>(`${this.apiUrl}/Add`, userPayload).pipe(
      map(response => {
        if (response.isSuccess && response.result) {
          return response.result;
        }
        throw new Error(response.errorMessage || 'Registration failed');
      }),
      catchError(this.handleError)
    );
  }

  // Customer login
  login(email: string, password: string): Observable<UserDto> {
    return this.http.post<ApiResponse<UserDto>>(`${this.apiUrl}/Connect`, { email, password })
      .pipe(
        map(response => {
          if (response && response.isSuccess && response.result) {
            this.handleAuthentication(response.result);
            return response.result;
          }
          throw new Error(response.errorMessage || 'Login failed');
        }),
        catchError(this.handleError)
      );
  }

  // Admin login
  loginAdmin(email: string, password: string): Observable<UserDto> {
    return this.http.post<ApiResponse<UserDto>>(`${this.apiUrl}/AuthenticateAdmin`, { email, password })
      .pipe(
        map(response => {
          if (response && response.isSuccess && response.result) {
            this.handleAuthentication(response.result);
            return response.result;
          }
          throw new Error(response.errorMessage || 'Admin login failed');
        }),
        catchError(this.handleError)
      );
  }

  // Employee login
  loginEmployee(email: string, password: string): Observable<UserDto> {
    return this.http.post<ApiResponse<UserDto>>(`${this.apiUrl}/AuthenticateEmployee`, { email, password })
      .pipe(
        map(response => {
          if (response && response.isSuccess && response.result) {
            this.handleAuthentication(response.result);
            return response.result;
          }
          throw new Error(response.errorMessage || 'Employee login failed');
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Clear all auth data
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiration');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Auto login on app initialization
  autoLogin(): void {
    const userData = this.getUserFromLocalStorage();
    if (!userData) {
      return;
    }
    this.currentUserSubject.next(userData);

    const expirationDate = localStorage.getItem('tokenExpiration');
  if (expirationDate) {
    const expirationTime = new Date(expirationDate).getTime() - new Date().getTime();
    if (expirationTime > 0) {
      this.autoLogout(expirationTime);
    } else {
      // If token is expired, clear data
      this.logout();
    }
  } else {
    // If no expiration was set, set default expiration (1 hour)
    const newExpirationDate = new Date(new Date().getTime() + 3600 * 1000);
    localStorage.setItem('tokenExpiration', newExpirationDate.toISOString());
    this.autoLogout(3600 * 1000);
  }
}

  // Auto logout when session expires
  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.currentUserValue?.userAccessType === 3; // Update with your actual Admin enum value
  }

  // Check if user is employee
  isEmployee(): boolean {
    return this.currentUserValue?.userAccessType === 2; // Update with your actual Employee enum value
  }

  // Check if user is customer
  isCustomer(): boolean {
    return this.currentUserValue?.userAccessType === 1; // Update with your actual Customer enum value
  }

  private handleAuthentication(userData: UserDto): void {
    // Set token expiration (e.g., 1 hour)
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    
    this.currentUserSubject.next(userData);
    this.autoLogout(3600 * 1000); // 1 hour
  }

  private getUserFromLocalStorage(): UserDto | null {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return null;
    }
    return JSON.parse(userData);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.errorMessage) {
      // Server-side error with message
      errorMessage = error.error.errorMessage;
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials. Please check your email and password.';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to access this resource.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}