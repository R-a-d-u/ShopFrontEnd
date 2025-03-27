import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
    private apiUrl = environment.apiUrl + '/SaleRecords';

  constructor(private http: HttpClient) {}

  getHourlySalesSummary(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get(`${this.apiUrl}/GetHourlySalesSummary`, { params });
  }

  getProductSalesSummary(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get(`${this.apiUrl}/GetProductSalesSummary`, { params });
  }

  getRevenueAnalysis(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get(`${this.apiUrl}/GetRevenueAnalysis`, { params });
  }

  getCategorySalesPerformance(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get(`${this.apiUrl}/GetCategorySalesPerformance`, { params });
  }
}