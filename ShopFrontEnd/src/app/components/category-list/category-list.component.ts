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

  showAuthDialog: boolean = false;
  currentCategoryId: number = 0;
  currentCategoryName: string = '';
  dialogHeader: string = '';

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
  deleteCategory(categoryId: number, categoryName: string): void {
    this.dialogHeader = "Confirm category deletion!";
    this.currentCategoryId = categoryId;
    this.currentCategoryName = categoryName;
    this.showAuthDialog = true;
  }
  handleAuthSuccess(categoryId: number): void {
    // Authentication was successful, proceed with category deletion
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
            detail: `Category ${this.currentCategoryName} has been successfully deleted.`,
            life: 3000
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Deletion Failed',
          detail: `An error occurred while deleting the category: ${error.message}`,
          life: 3000
        });
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