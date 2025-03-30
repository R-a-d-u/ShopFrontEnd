// category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { CategoryDto, CategoryDetailDto } from '../models/category.model';
import { ResponseValidator } from '../models/response-validator.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllCategoryNames(): Observable<CategoryDto[]> {
    return this.http.get<ResponseValidator<CategoryDto[]>>(`${this.apiUrl}/Category/GetAllNames`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to get categories');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get categories'));
        })
      );
  }

  getCategoryById(categoryId: number): Observable<CategoryDetailDto> {
    return this.http.get<ResponseValidator<CategoryDetailDto>>(`${this.apiUrl}/Category/Get/${categoryId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Category not found');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'Failed to get category details'));
        })
      );
  }

  addCategory(categoryName: string): Observable<boolean> {
    const categoryData = {
      name: categoryName,
      lastModifiedDate: new Date().toISOString()
    };

    return this.http.post<ResponseValidator<boolean>>(`${this.apiUrl}/Category/Add`, categoryData)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to add category');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'An error occurred while adding the category. Please try again.'));
        })
      );
  }

  editCategoryName(categoryId: number, categoryName: string): Observable<boolean> {
    const categoryData = {
      name: categoryName,
      lastModifiedDate: new Date().toISOString()
    };

    return this.http.put<ResponseValidator<boolean>>(`${this.apiUrl}/Category/EditName/${categoryId}`, categoryData)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to edit category');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'An error occurred while editing the category. Please try again.'));
        })
      );
  }
  deleteCategory(categoryId: number): Observable<boolean> {
    return this.http.delete<ResponseValidator<boolean>>(`${this.apiUrl}/Category/Delete/${categoryId}`)
      .pipe(
        map(response => {
          if (response && response.isSuccess) {
            return response.result;
          }
          throw new Error(response.errorMessage || 'Failed to delete category');
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error?.errorMessage || 'An error occurred while deleting the category. Please try again.'));
        })
      );
  }
}