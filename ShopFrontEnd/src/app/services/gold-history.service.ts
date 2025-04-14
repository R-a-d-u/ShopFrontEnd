import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import {GoldPriceHistory} from '../models/gold.model'

@Injectable({
  providedIn: 'root', // Ensure this is present
})
export class GoldHistoryService {
  private apiUrl = environment.apiUrl + '/GoldHistory';

  constructor(private http: HttpClient) {}

  getGoldPriceHistory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetLast7`);
  }

  getGoldPriceInGrams(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetLastPriceInGrams`);
  }
  getLastGoldPriceHistory(): Observable<{ isSuccess: boolean, result: GoldPriceHistory, errorMessage: string | null }> {
    return this.http.get<{ isSuccess: boolean, result: GoldPriceHistory, errorMessage: string | null }>(`${this.apiUrl}/GetLastGoldPriceHistory`);
  }
  getGoldHistoryBetweenDates(startDate: string, endDate: string): Observable<{ 
    isSuccess: boolean, 
    result: any[], 
    errorMessage: string | null 
  }> {
    return this.http.get<{
      isSuccess: boolean,
      result: any[],
      errorMessage: string | null
    }>(`${this.apiUrl}/GetBetweenDates?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
  }
}
