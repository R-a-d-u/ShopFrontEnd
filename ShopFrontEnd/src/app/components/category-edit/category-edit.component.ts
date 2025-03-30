import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
  categoryForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  categoryId: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    this.loading = true;
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: this.errorMessage || 'Failed to load category'
        });
      }
    });
  }

  get f() { return this.categoryForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const categoryName = this.categoryForm.get('name')?.value;

    this.categoryService.editCategoryName(this.categoryId, categoryName).subscribe({
      next: (result) => {
        this.loading = false;
        if (result) {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Category updated successfully' 
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
          detail: this.errorMessage || 'Failed to update category'
        });
      }
    });
  }
}