// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AosService } from 'src/aos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private aosService: AosService
  ) { }

  ngOnInit() {
    // Initialize AOS
    this.aosService.initialize();

    // Refresh AOS on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        this.aosService.refresh();
      }, 100); // Small delay to ensure DOM is updated
    });
  }
}
