import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoldHistoryService {
  private apiUrl = environment.apiUrl + '/GoldHistory';

  constructor(private http: HttpClient) { }

  getGoldPriceInGrams(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetLastPriceInGrams`);
  }
}
