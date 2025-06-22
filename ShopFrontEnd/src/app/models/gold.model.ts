// src/app/models/gold-price-history.model.ts

export interface GoldPriceHistory {
    id: number;
    metal: string;
    priceOunce: number;
    priceGram: number;
    percentageChange: number;
    exchange: string;
    timestamp: string;
    date: string;
  }
  