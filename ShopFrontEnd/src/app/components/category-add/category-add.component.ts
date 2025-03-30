import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {
  categoryForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  get f() { return this.categoryForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const categoryName = this.categoryForm.get('name')?.value;

    this.categoryService.addCategory(categoryName).subscribe({
      next: (result) => {
        this.loading = false;
        if (result) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Category added successfully' 
          });
          this.router.navigate(['/admin/category']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: this.errorMessage || 'Failed to add category'
        });
      }
    });
  }
}