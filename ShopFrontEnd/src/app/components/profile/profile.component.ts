// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: UserDto | null = null;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
  }

  
requestPasswordReset(): void {
  if (!this.currentUser || !this.currentUser.email) {
    this.messageService.add({
      severity: 'danger',
      summary: 'Error',
      detail: 'User email not available',
      life: 1500
    });
    return;
  }

  this.userService.requestPasswordReset(this.currentUser.email)
    .pipe(finalize(() => {
     
    }))
    .subscribe({
      next: (response) => {
        const message = response.errorMessage || 'Request completed check your email.';

        if (response.isSuccess ) {
          this.messageService.add({
            severity: 'warn',
            detail: message,
            life: 1500
          });
        } else {
          this.messageService.add({
            severity: 'danger',
            detail: message,
            life: 1500
          });
        }
      },
      error: (err) => {
        let errorMessage = 'Failed to request password reset. Please try again later.';

        if (err.error && err.error.errorMessage) {
          errorMessage = err.error.errorMessage;
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.messageService.add({
          severity: 'danger',
          detail: errorMessage,
          life: 1500
        });
      }
    });
}
}