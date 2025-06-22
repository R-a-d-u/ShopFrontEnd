// pdf-download.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfDownloadService {
  private cooldownPeriod: number = 60000; 
  private storageKey: string = 'pdf_last_download_time';
  
  canDownload(): boolean {
    const lastTime = this.getLastDownloadTime();
    return Date.now() - lastTime >= this.cooldownPeriod;
  }
  
  getRemainingTime(): number {
    const lastTime = this.getLastDownloadTime();
    const remaining = this.cooldownPeriod - (Date.now() - lastTime);
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }
  
  setLastDownloadTime(): void {
    localStorage.setItem(this.storageKey, Date.now().toString());
  }
  
  private getLastDownloadTime(): number {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? parseInt(stored, 10) : 0;
  }
}