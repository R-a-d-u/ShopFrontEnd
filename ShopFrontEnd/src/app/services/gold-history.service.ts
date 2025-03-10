import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

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
}
