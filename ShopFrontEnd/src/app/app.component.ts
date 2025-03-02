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

    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Scroll to top on every route change
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Refresh AOS with a slight delay to ensure DOM updates
      setTimeout(() => {
        this.aosService.refresh();
      }, 100);
    });
  }
}
