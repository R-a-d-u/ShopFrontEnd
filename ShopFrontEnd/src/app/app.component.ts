import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AosService } from 'src/aos.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private aosService: AosService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.aosService.initialize();
    this.authService.autoLogin();

    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
   
      window.scrollTo({ top: 0, behavior: 'smooth' });

     
      setTimeout(() => {
        this.aosService.refresh();
      }, 100);
    });
  }
}
