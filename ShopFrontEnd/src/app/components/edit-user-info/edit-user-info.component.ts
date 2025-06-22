// src/app/components/edit-user-info/edit-user-info.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, UserUpdateData } from '../../services/user.service';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; 

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
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
    
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.userId = currentUser.id;
    
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
  
  get f() { return this.editForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
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
            this.messageService.add({
              severity: 'warn',
              detail: 'User info updated successfully.',
              life: 1500 // 2 seconds
            });
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
            
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          } else {
            this.error = response.errorMessage || 'Failed to update user information';
          }
        },
        error: (err) => {
          this.error = err.message || 'An error occurred while updating user information';
          this.messageService.add({
            severity: 'danger',
            detail: 'An error occurred while updating user information',
            life: 1500
          });
        }
      });
  }
}