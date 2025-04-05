import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  userAccessType: number;
  lastModifyDate: string;
  isDeleted: boolean;
}

export interface UserUpdateData {
  name: string;
  phoneNumber: string;
  lastModifyDate: string;
}

export interface PasswordUpdateData {
  password: string;
  lastModifyDate: string;
}

export interface PaginatedResponse<T> {
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
export class UserService {
  private apiUrl = environment.apiUrl + '/User';

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<ResponseValidator<User>> {
    return this.http.get<ResponseValidator<User>>(`${this.apiUrl}/Get/${id}`);
  }

  getAllAdmins(page: number = 1): Observable<ResponseValidator<PaginatedResponse<User>>> {
    return this.http.get<ResponseValidator<PaginatedResponse<User>>>(`${this.apiUrl}/GetAllAdmins?page=${page}`);
  }

  getAllEmployees(page: number = 1): Observable<ResponseValidator<PaginatedResponse<User>>> {
    return this.http.get<ResponseValidator<PaginatedResponse<User>>>(`${this.apiUrl}/GetAllEmployees?page=${page}`);
  }

  getAllCustomers(page: number = 1): Observable<ResponseValidator<PaginatedResponse<User>>> {
    return this.http.get<ResponseValidator<PaginatedResponse<User>>>(`${this.apiUrl}/GetAllCustomers?page=${page}`);
  }

  getUsersByName(name: string, page: number = 1): Observable<ResponseValidator<PaginatedResponse<User>>> {
    return this.http.get<ResponseValidator<PaginatedResponse<User>>>(`${this.apiUrl}/GetByName?name=${name}&page=${page}`);
  }

  getUsersByEmail(email: string, page: number = 1): Observable<ResponseValidator<PaginatedResponse<User>>> {
    return this.http.get<ResponseValidator<PaginatedResponse<User>>>(`${this.apiUrl}/GetByEmail?email=${email}&page=${page}`);
  }

  updateUser(id: number, updateData: UserUpdateData): Observable<ResponseValidator<User>> {
    return this.http.put<ResponseValidator<User>>(`${this.apiUrl}/Edit/${id}`, updateData);
  }

  updateUserPassword(id: number, passwordData: PasswordUpdateData): Observable<ResponseValidator<User>> {
    return this.http.put<ResponseValidator<User>>(`${this.apiUrl}/EditPassword/${id}`, passwordData);
  }

  setUserAsAdmin(id: number): Observable<ResponseValidator<User>> {
    return this.http.put<ResponseValidator<User>>(`${this.apiUrl}/SetAsAdmin/${id}`, {});
  }

  setUserAsEmployee(id: number): Observable<ResponseValidator<User>> {
    return this.http.put<ResponseValidator<User>>(`${this.apiUrl}/SetAsEmployee/${id}`, {});
  }

  deleteUser(id: number): Observable<ResponseValidator<boolean>> {
    return this.http.delete<ResponseValidator<boolean>>(`${this.apiUrl}/Delete/${id}`);
  }
}