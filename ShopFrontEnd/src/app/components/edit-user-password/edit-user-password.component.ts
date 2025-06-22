// src/app/components/edit-user-password/edit-user-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, ResetPasswordData } from '../../services/user.service';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; 
import { timer } from 'rxjs';

@Component({
  selector: 'app-edit-user-password',
  templateUrl: './edit-user-password.component.html',
  styleUrls: ['./edit-user-password.component.css']
})
export class EditUserPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  token: string | null = null;
  email: string | null = null;
  isResetMode = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      this.email = params['email'] || null;
      
      this.isResetMode = !!this.token;
      
      if (!this.isResetMode) {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
          this.router.navigate(['/login']);
          return;
        }
      }
    });
    
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      control.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }
  
  get f() { return this.passwordForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';
    
    if (this.passwordForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const resetData: ResetPasswordData = {
      token: this.token || '', // Use empty string instead of null
      newPassword: this.f['password'].value
    };
    
    if (!this.isResetMode) {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }
    }
    
    this.userService.resetPassword(resetData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.messageService.add({
              severity: 'warn',
              detail: this.isResetMode ? 'Password has been reset successfully.' : 'Password updated successfully.',
              life: 1500
            });
            
            this.success = this.isResetMode ? 'Password has been reset successfully' : 'Password updated successfully';
            this.passwordForm.reset();
            this.submitted = false;
            
            if (this.isResetMode) {
              if (this.authService.currentUserValue) {
                timer(3000).subscribe(() => {
                this.authService.logout();
              });
              }
            } else {
              const currentUser = this.authService.currentUserValue;
              if (currentUser) {
                const updatedUser = {
                  ...currentUser,
                  lastModifyDate: new Date().toISOString()
                };
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                this.authService['currentUserSubject'].next(updatedUser);
              }
              timer(5000).subscribe(() => {
                this.router.navigate(['/profile']);
              });
            }
          } else {
            this.error = response.errorMessage || 'Failed to update password';
            this.messageService.add({
              severity: 'danger',
              detail: this.error,
              life: 1500
            });
          }
        },
        error: (err) => {
          if (err.error && err.error.errorMessage) {
            this.error = err.error.errorMessage;
          } else {
            this.error = err.message || 'An error occurred while updating password';
          }
          
          this.messageService.add({
            severity: 'danger',
            detail: this.error,
            life: 1500
          });
        }
  
  

  
  
 })}}