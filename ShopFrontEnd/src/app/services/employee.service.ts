import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';

interface ApiResponse<T> {
  isSuccess: boolean;
  result: T;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getActiveUsers(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/User/CountActiveUsers`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get active users');
        }),
        catchError(this.handleError)
      );
  }

  getLowStockProducts(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/Product/LowStockProductsCount`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get low stock products');
        }),
        catchError(this.handleError)
      );
  }

  getTotalProducts(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/Product/TotalNonDiscontinuedProducts`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get total products');
        }),
        catchError(this.handleError)
      );
  }

  getPendingOrders(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/Order/CountCreatedAndPending`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get pending orders');
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error?.errorMessage || 'An error occurred'));
  }
}