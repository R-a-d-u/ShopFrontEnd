// auth-confirm-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-confirm-dialog',
  templateUrl: './auth-confirm-dialog.component.html',
  styleUrls: ['./auth-confirm-dialog.component.css']
})
export class AuthConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() userName: string = '';
  @Input() userId: number = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() authSuccess = new EventEmitter<number>();
  @Input() dialogHeader: string = 'Confirm!';
  @Input() authMessage: string = ''; 
  authForm: FormGroup;
  loading: boolean = false;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  hideDialog() {
    this.resetForm();
    this.visible = false;
    this.visibleChange.emit(false);
  }
  
  resetForm() {
    this.authForm.reset();
    this.errorMessage = null;
  }
  
  onConfirm() {
    if (this.authForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      
      const { email, password } = this.authForm.value;
      
      this.userService.authenticateAdmin(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.isSuccess && response.result) {
            this.resetForm();
            this.visible = false;
            this.visibleChange.emit(false);
            this.authSuccess.emit(this.userId);
          } else {
            this.errorMessage = response.errorMessage || 'Authentication failed. Please check your credentials.';
            this.authService.logout();
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.errorMessage || 'Authentication failed. Please try again.';
        }
      });
    }
  }
}