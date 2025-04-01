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
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ResponseValidator<T> {
  isSuccess: boolean;
  result: T | null;
  errorMessage: string | null;
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
      .set('pageSize', pageSize.toString());
    
    return this.http.get<ResponseValidator<PagedResult<Product>>>(`${this.apiUrl}/GetByCategory/${categoryId}`, { params });
  }

  getAllDiscontinuedProducts(page: number = 1, pageSize: number = 5): Observable<ResponseValidator<PagedResult<Product>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<ResponseValidator<PagedResult<Product>>>(`${this.apiUrl}/GetAllDiscontinued`, { params });
  }

  getProductsByName(name: string, page: number = 1, pageSize: number = 5): Observable<ResponseValidator<PagedResult<Product>>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<ResponseValidator<PagedResult<Product>>>(`${this.apiUrl}/GetByName`, { params });
  }
  addProduct(product: any): Observable<ResponseValidator<number>> {
    return this.http.post<ResponseValidator<number>>(`${this.apiUrl}/Add`, product);
  }

  // Additional methods for product state changes
  setProductInStock(productId: number): Observable<ResponseValidator<boolean>> {
    return this.http.put<ResponseValidator<boolean>>(`${this.apiUrl}/SetInStock/${productId}`, {});
  }

  setProductOutOfStock(productId: number): Observable<ResponseValidator<boolean>> {
    return this.http.put<ResponseValidator<boolean>>(`${this.apiUrl}/SetOutOfStock/${productId}`, {});
  }

  setProductDiscontinued(productId: number): Observable<ResponseValidator<boolean>> {
    return this.http.put<ResponseValidator<boolean>>(`${this.apiUrl}/SetDiscontinued/${productId}`, {});
  }
  editStock(productId: number, stockQuantity: number): Observable<ResponseValidator<boolean>> {
    return this.http.put<ResponseValidator<boolean>>(`${this.apiUrl}/EditStock/${productId}`, { stockQuantity });
  }
  editPrice(productId: number, additionalValue: number): Observable<ResponseValidator<boolean>> {
    return this.http.put<ResponseValidator<boolean>>(`${this.apiUrl}/EditPrice/${productId}`, { additionalValue });
  }
  
  editInformation(productId: number, productInfo: {
    name: string,
    image: string,
    categoryId: number,
    description: string,
    productType: number
  }): Observable<ResponseValidator<boolean>> {
    return this.http.put<ResponseValidator<boolean>>(`${this.apiUrl}/EditInformation/${productId}`, productInfo);
  }
}