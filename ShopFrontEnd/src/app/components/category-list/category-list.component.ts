// category-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryDto } from '../../models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: CategoryDto[] = [];
  filteredCategories: CategoryDto[] = [];
  loading = false;
  errorMessage = '';
  searchQuery = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategoryNames().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }
  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: (success) => {
          if (success) {
            // Remove the deleted category from the list
            this.categories = this.categories.filter(category => category.id !== categoryId);
            this.filteredCategories = this.filteredCategories.filter(category => category.id !== categoryId);
          }
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  searchCategories(): void {
    if (!this.searchQuery) {
      this.filteredCategories = this.categories;
      return;
    }
    
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  viewCategoryDetails(categoryId: number): void {
    this.router.navigate(['/admin/category/details', categoryId]);
  }

  editCategory(categoryId: number): void {
    this.router.navigate(['/admin/category/edit', categoryId]);
  }

  addCategory(): void {
    this.router.navigate(['/admin/category/add']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
}