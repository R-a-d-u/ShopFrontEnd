import { Component, OnInit } from '@angular/core';
import { GoldHistoryService } from '../../services/gold-history.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {GoldPriceHistory} from '../../models/gold.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  goldPriceInGrams: number | null = null;
  goldPriceInOunces: number | null = null;
  goldPriceHistory: GoldPriceHistory | null = null; // Use the model here
  loading = false;
  error: string | null = null;

  constructor(private goldHistoryService: GoldHistoryService) { }

  ngOnInit(): void {
    this.loading = true;
    this.getGoldPrice();
    this.getGoldPriceHistory();
  }

  getGoldPrice(): void {
    this.goldHistoryService.getGoldPriceInGrams().pipe(
      switchMap(response => {
        if (response && response.isSuccess) {
          this.goldPriceInGrams = response.result;
          if (this.goldPriceInGrams !== null) {
            this.goldPriceInOunces = this.convertGramsToOunces(this.goldPriceInGrams);
          }
          return of(response);
        } else {
          this.error = response?.errorMessage || 'Failed to fetch gold price';
          return of(null);
        }
      })
    ).subscribe({
      next: (response) => {
        if (response && response.isSuccess) {
          if (this.goldPriceInGrams !== null) {
            this.goldPriceInOunces = this.convertGramsToOunces(this.goldPriceInGrams);
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.errorMessage || 'An error occurred while fetching gold prices';
        this.loading = false;
      }
    });
  }

  convertGramsToOunces(priceInGrams: number): number {
    const gramsPerOunce = 31.1035; // 1 ounce = 31.1035 grams
    return priceInGrams * gramsPerOunce;
  }

  getGoldPriceHistory(): void {
    this.goldHistoryService.getLastGoldPriceHistory().pipe(
      switchMap(response => {
        if (response && response.isSuccess) {
          this.goldPriceHistory = response.result; 
          return of(response);
        } else {
          this.error = response?.errorMessage || 'Failed to fetch gold price history';
          return of(null);
        }
      })
    ).subscribe({
      next: (response) => {
        if (response && response.isSuccess) {
          this.goldPriceHistory = response.result;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.errorMessage || 'An error occurred while fetching gold price history';
        this.loading = false;
      }
    });
  }
}
