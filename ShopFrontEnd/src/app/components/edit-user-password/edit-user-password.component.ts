// src/app/components/edit-user-password/edit-user-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, PasswordUpdateData } from '../../services/user.service';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; 

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
  userId!: number;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Get current user ID
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.userId = currentUser.id;
    
    // Initialize the form with password matching validators
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  // Custom validator to check if passwords match
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
  
  // Convenience getter for easy access to form fields
  get f() { return this.passwordForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';
    
    // Stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const passwordData: PasswordUpdateData = {
      password: this.f['password'].value,
      lastModifyDate: new Date().toISOString()
    };
    
    this.userService.updateUserPassword(this.userId, passwordData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {

            this.messageService.add({
              severity: 'warn',
              detail: 'Password updated successfully.',
              life: 1500 // 2 seconds
            });
            // Show success message
            this.success = 'Password updated successfully';
            // Reset form
            this.passwordForm.reset();
            this.submitted = false;
            
            // Update the lastModifyDate in the stored user data
            const currentUser = this.authService.currentUserValue;
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                lastModifyDate: passwordData.lastModifyDate
              };
              localStorage.setItem('userData', JSON.stringify(updatedUser));
              this.authService['currentUserSubject'].next(updatedUser);
            }
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          } else {
            this.error = response.errorMessage || 'Failed to update password';
          }
        },
        error: (err) => {
          this.error = err.message || 'An error occurred while updating password';
          this.messageService.add({
            severity: 'danger',
            detail: 'An error occurred while updating password.',
            life: 1500
          });
        }
      });
  }
}