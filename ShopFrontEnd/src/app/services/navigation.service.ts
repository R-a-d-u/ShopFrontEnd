import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navEnd = event as NavigationEnd; 
        this.previousUrl = this.currentUrl;
        this.currentUrl = navEnd.urlAfterRedirects;
      });
  }

  public getPreviousUrl(): string | null {
    return this.previousUrl;
  }

  public previousUrlContainsAdmin(): boolean {
    return this.previousUrl?.includes('admin') ?? false;
  }
}
