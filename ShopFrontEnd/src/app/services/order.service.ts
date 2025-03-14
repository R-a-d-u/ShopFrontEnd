// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { OrderDto } from '../models/order.model';
import { PagedResult } from '../models/paged-result.model';
import { ResponseValidator } from '../models/response-validator.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getOrdersByUserId(userId: number, page: number = 1): Observable<PagedResult<OrderDto>> {
    return this.http.get<ResponseValidator<PagedResult<OrderDto>>>(`${this.apiUrl}/Order/GetAllByUser/${userId}?page=${page}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get orders');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get orders'));
        })
      );
  }
}