// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

export interface Product {
  id: number;
  productType: number;
  name: string;
  additionalValue: number;
  goldWeightInGrams: number;
  sellingPrice: number;
  stockQuantity: number;
  categoryId: number;
  productState: number;
  description: string;
  image: string | null;
  lastModifiedDate: string;
  category?: any;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;      // Changed from 'totalCount'
  pageNumber: number;      // Changed from 'currentPage'
  pageSize: number;
  totalPages: number;
}

export interface ResponseValidator<T> {
  isSuccess: boolean;
  result: T | null;  // Changed from 'data' to 'result'
  errorMessage: string | null;  // Changed from 'message' to 'errorMessage'
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/Product';

  constructor(private http: HttpClient) { }

  getProductById(id: number): Observable<ResponseValidator<Product>> {
    return this.http.get<ResponseValidator<Product>>(`${this.apiUrl}/Get/${id}`);
  }

  getAllProductsByCategoryId(categoryId: number, page: number = 1, pageSize: number = 4): Observable<ResponseValidator<PagedResult<Product>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString()); // Pass page size to API
  
    return this.http.get<ResponseValidator<PagedResult<Product>>>(`${this.apiUrl}/GetByCategory/${categoryId}`, { params });
  }
}
