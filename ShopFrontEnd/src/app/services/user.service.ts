// src/app/services/user.service.ts
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
}
