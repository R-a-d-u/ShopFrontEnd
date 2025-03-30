import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryDetailDto } from '../../models/category.model';
import { MessageService } from 'primeng/api';

export enum ProductState {
  inStock = 1,
  outOfStock = 2,
  Discontinued = 3
}
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  categoryId: number;
  category: CategoryDetailDto | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadCategoryDetails();
  }

  loadCategoryDetails(): void {
    this.loading = true;
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (data) => {
        this.category = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: this.errorMessage || 'Failed to load category details'
        });
      }
    });
  }

  editCategory(): void {
    this.router.navigate(['/admin/category/edit', this.categoryId]);
  }

  backToList(): void {
    this.router.navigate(['/admin/category']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  getProductStateDetails(state: ProductState): { label: string, cssClass: string } {
    switch (state) {
      case ProductState.inStock:
        return { label: 'In Stock', cssClass: 'in-stock' };
      case ProductState.outOfStock:
        return { label: 'Out of Stock', cssClass: 'out-of-stock' };
      case ProductState.Discontinued:
        return { label: 'Discontinued', cssClass: 'discontinued' };
      default:
        return { label: 'Unknown', cssClass: '' };
    }
  }
}