import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-edit-stock',
  templateUrl: './product-edit-stock.component.html',
  styleUrls: ['./product-edit-stock.component.css']
})
export class ProductEditStockComponent implements OnInit {
  productId: number = 0;
  product: Product | null = null;
  stockForm: FormGroup;
  loading: boolean = true;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ) {
    this.stockForm = this.fb.group({
      stockQuantity: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.product = response.result;
          this.stockForm.patchValue({
            stockQuantity: this.product.stockQuantity
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errorMessage || 'Failed to load product'
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while loading the product'
        });
        this.loading = false;
      }
    });
  }

  get f() {
    return this.stockForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.stockForm.invalid) {
      return;
    }

    this.loading = true;
    const stockQuantity = this.stockForm.value.stockQuantity;

    this.productService.editStock(this.productId, stockQuantity).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
            this.router.navigate(['/admin/inventory']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.errorMessage || 'Failed to update stock quantity'
          });
          this.loading = false;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while updating stock quantity'
        });
        this.loading = false;
      }
    });
  }
}