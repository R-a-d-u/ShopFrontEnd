// gold-history.component.ts
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GoldHistoryService } from '../../services/gold-history.service';
import { GoldPriceHistory } from '../../models/gold.model';

interface GoldHistoryRecord {
  id: number;
  metal: string;
  priceOunce: number;
  priceGram: number;
  percentageChange: number;
  exchange: string;
  timestamp: string;
  date: string;
}

@Component({
  selector: 'app-gold-history',
  templateUrl: './gold-history.component.html',
  styleUrls: ['./gold-history.component.css']
})
export class GoldHistoryComponent implements OnInit {
  goldHistory: GoldHistoryRecord[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;
  
  startDate: Date = new Date();
  endDate: Date = new Date();
  
  constructor(
    private goldHistoryService: GoldHistoryService,
    private messageService: MessageService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    // Set default date range (last 6 months)
    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setMonth(this.startDate.getMonth() - 6);
    
    this.loadGoldHistory();
  }
  
  loadGoldHistory(): void {
    this.loading = true;
    this.errorMessage = null;
    
    // Format dates for API call
    const formattedStartDate = this.formatDateForApi(this.startDate);
    const formattedEndDate = this.formatDateForApi(this.endDate);
    
    // Use the service to get data
    this.goldHistoryService.getGoldHistoryBetweenDates(formattedStartDate, formattedEndDate).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.goldHistory = response.result;
        } else {
          this.errorMessage = response.errorMessage || 'Unknown error occurred';
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: this.errorMessage
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || error.message || 'Error loading gold history';
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: this.errorMessage ?? 'Something went wrong'
        });
        this.loading = false;
      }
    });
  }
  
  formatDateForApi(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 00:00:00.000`;
  }
  
  onSearch(): void {
    if (this.startDate > this.endDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Start date cannot be after end date'
      });
      return;
    }
    
    this.loadGoldHistory();
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  getPercentageClass(percentageChange: number): string {
    if (percentageChange > 0) {
      return 'positive-change';
    } else if (percentageChange < 0) {
      return 'negative-change';
    } else {
      return '';
    }
  }
  
  goBack(): void {
    this.router.navigate(['/admin']);
  }
  get startDateString(): string {
    return this.toDateTimeLocal(this.startDate);
  }
  set startDateString(value: string) {
    this.startDate = new Date(value);
  }
  
  get endDateString(): string {
    return this.toDateTimeLocal(this.endDate);
  }
  set endDateString(value: string) {
    this.endDate = new Date(value);
  }
  
  toDateTimeLocal(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
  }
}