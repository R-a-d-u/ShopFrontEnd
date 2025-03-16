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

  getOrderById(orderId: string): Observable<OrderDto> {
    return this.http.get<ResponseValidator<OrderDto>>(`${this.apiUrl}/Order/Get/${orderId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Order not found');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get order details'));
        })
      );
  }
  createOrderFromCart(cartId: number, userAddress: string, paymentMethod: number): Observable<OrderDto> {
    const orderData = {
      cartId: cartId,
      userAddress: userAddress,
      paymentMethod: paymentMethod
    };

    return this.http.post<ResponseValidator<OrderDto>>(`${this.apiUrl}/Order/CreateFromCart`, orderData)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to create order');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'An error occurred while processing your order. Please try again.'));
        })
      );
  }
}