import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Check if user is admin, redirect if not
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }

  }
  logout(): void {
    this.authService.logout();
  }
}
