// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDto } from '../models/user.model';
import { environment } from '../../enviroments/environment';

interface AuthResponse {
  user: UserDto;
  token: string;
  expiresAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  result: T;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/User`;
  private currentUserSubject: BehaviorSubject<UserDto | null>;
  public currentUser$: Observable<UserDto | null>;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserDto | null>(this.getUserFromLocalStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserDto | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('token');
  }

  register(name: string, email: string, password: string, phoneNumber: string, userAccessType: number): Observable<UserDto> {
    const userPayload = {
      name,
      email,
      password,
      phoneNumber,
      userAccessType,
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

  login(email: string, password: string): Observable<UserDto> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/Connect`, { email, password })
      .pipe(
        map(response => {
          if (response && response.isSuccess && response.result) {
            this.handleAuthentication(response.result);
            return response.result.user;
          }
          throw new Error(response.errorMessage || 'Login failed');
        }),
        catchError(this.handleError)
      );
  }

  loginAdmin(email: string, password: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/AuthenticateAdmin`, { email, password })
      .pipe(
        map(response => {
            console.log('Auth response:', response);
          if (response && response.isSuccess) {
            console.log(response.result)
            return response.result;
          }
          throw new Error(response.errorMessage || 'Admin login failed');
        }),
        catchError(this.handleError)
      );
  }

  loginEmployee(email: string, password: string): Observable<UserDto> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/AuthenticateEmployee`, { email, password })
      .pipe(
        map(response => {
          if (response && response.isSuccess && response.result) {
            this.handleAuthentication(response.result);
            return response.result.user;
          }
          throw new Error(response.errorMessage || 'Employee login failed');
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  autoLogin(): void {
    const userData = this.getUserFromLocalStorage();
    const token = this.token;
    
    if (!userData || !token) {
      return;
    }

    const expirationDate = localStorage.getItem('tokenExpiration');
    if (expirationDate) {
      const expirationTime = new Date(expirationDate).getTime() - new Date().getTime();
      if (expirationTime > 0) {
        this.currentUserSubject.next(userData);
        this.autoLogout(expirationTime);
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  isAuthenticated(): boolean {
    const token = this.token;
    const user = this.currentUserValue;
    
    if (!token || !user) {
      return false;
    }

    const expirationDate = localStorage.getItem('tokenExpiration');
    if (expirationDate) {
      return new Date(expirationDate).getTime() > new Date().getTime();
    }
    
    return false;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.userAccessType === 3;
  }

  isEmployee(): boolean {
    return this.currentUserValue?.userAccessType === 2;
  }

  isCustomer(): boolean {
    return this.currentUserValue?.userAccessType === 1;
  }

  private handleAuthentication(authData: AuthResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('userData', JSON.stringify(authData.user));
    localStorage.setItem('tokenExpiration', authData.expiresAt);
    
    this.currentUserSubject.next(authData.user);
    
    const expirationTime = new Date(authData.expiresAt).getTime() - new Date().getTime();
    this.autoLogout(expirationTime);
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
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.errorMessage) {
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