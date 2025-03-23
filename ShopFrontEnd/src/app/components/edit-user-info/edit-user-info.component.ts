// src/app/components/edit-user-info/edit-user-info.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, UserUpdateData } from '../../services/user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.css']
})
export class EditUserInfoComponent implements OnInit {
  editForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  userId!: number;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Initialize the form
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
    
    // Get current user ID
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.userId = currentUser.id;
    
    // Load user data
    this.loading = true;
    this.userService.getUserById(this.userId).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          // Populate form with user data
          this.editForm.patchValue({
            name: response.result.name,
            phoneNumber: response.result.phoneNumber
          });
        } else {
          this.error = response.errorMessage || 'Failed to load user data';
        }
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while loading user data';
      }
    });
  }
  
  // Convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const updateData: UserUpdateData = {
      name: this.f['name'].value,
      phoneNumber: this.f['phoneNumber'].value,
      lastModifyDate: new Date().toISOString()
    };
    
    this.userService.updateUser(this.userId, updateData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            // Update the local storage user data
            const currentUser = this.authService.currentUserValue;
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                name: updateData.name,
                phoneNumber: updateData.phoneNumber,
                lastModifyDate: updateData.lastModifyDate
              };
              localStorage.setItem('userData', JSON.stringify(updatedUser));
              this.authService['currentUserSubject'].next(updatedUser);
            }
            
            // Navigate to profile or dashboard
            this.router.navigate(['/profile']);
          } else {
            this.error = response.errorMessage || 'Failed to update user information';
          }
        },
        error: (err) => {
          this.error = err.message || 'An error occurred while updating user information';
        }
      });
  }
}