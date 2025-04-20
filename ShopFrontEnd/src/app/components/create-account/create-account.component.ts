import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  createAccountForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  successMessageShown = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  ngOnInit(): void {
    this.createAccountForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(formGroup: FormGroup): null | object {
    return formGroup.get('password')!.value === formGroup.get('confirmPassword')!.value 
      ? null 
      : { mismatch: true };
  }

  // Convenience getter for form fields
  get f() { return this.createAccountForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.createAccountForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { name, email, phoneNumber, password } = this.createAccountForm.value;

    this.authService.register(name, email, password, phoneNumber, 1).subscribe({
      next: () => {
        this.successMessageShown = true;
        this.loading = false;
      },
      error: error => {
        this.error = error.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.authService.isEmployee()) {
      this.router.navigate(['/employee']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
