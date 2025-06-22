import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  isSuccess = false;
  message = 'Confirming your email...';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.confirmEmail(token);
      } else {
        this.isLoading = false;
        this.message = 'Invalid confirmation link. No token provided.';
      }
    });
  }

  confirmEmail(token: string): void {
    this.userService.confirmEmail(token)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
  
          if (response.isSuccess) {
            this.isSuccess = true;
            this.message = 'Your email has been successfully confirmed!';
            timer(5000).subscribe(() => {
              this.router.navigate(['/login']);
            });
          } else {
            this.isSuccess = false;
            this.message = response.errorMessage || 'An error occurred during email confirmation.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.isSuccess = false;
  
          this.message = error?.error?.errorMessage || 'An unexpected error occurred. Please try again later.';
          console.error('Email confirmation error:', error);
        }
      });
  }
}