// category-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryDto } from '../../models/category.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

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
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    this.confirmationService.confirm({
      message: 'You will remove all the products inside this category',
      header: 'Confirm Deletion',
      accept: () => {
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: (success) => {
            if (success) {
              // Remove the deleted category from the lists
              this.categories = this.categories.filter(category => category.id !== categoryId);
              this.filteredCategories = this.filteredCategories.filter(category => category.id !== categoryId);
  
              // Show success toast
              this.messageService.add({
                severity: 'warn',
                summary: 'Category Deleted',
                detail: 'The category has been successfully deleted.',
                life: 3000
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',  // Note: 'danger' is not a standard severity in PrimeNG, use 'error'
              summary: 'Deletion Failed',
              detail: `An error occurred while deleting the category: ${error.message}`,
              life: 3000
            });
          }
        });
      },
      reject: () => {
        // Optional: You can add some action when user rejects
      }
    });
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
  goBack() : void{
    this.router.navigate(['/admin']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
}