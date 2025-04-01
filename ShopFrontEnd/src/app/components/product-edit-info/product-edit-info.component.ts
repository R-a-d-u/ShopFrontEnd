import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { MessageService } from 'primeng/api';

interface Category {
  id: number;
  name: string;
}

interface ProductType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-product-edit-info',
  templateUrl: './product-edit-info.component.html',
  styleUrls: ['./product-edit-info.component.css']
})
export class ProductEditInfoComponent implements OnInit {
  productId: number = 0;
  product: Product | null = null;
  infoForm: FormGroup;
  loading: boolean = true;
  submitted: boolean = false;
  
  categories: any[] = [];
  productTypes = [
    { id: 1, name: 'Jewelry' },
    { id: 2, name: 'Gold Coins' },
    { id: 3, name: 'Gold Bars' },
    { id: 4, name: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {
    this.infoForm = this.fb.group({
      name: ['', [Validators.required]],
      image: [''],
      productType: [1, [Validators.required]],
      categoryId: ['', [Validators.required]],
      description: [''],
      lastModifiedDate: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadCategories();
      this.loadProduct();
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategoryNames().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        const errorMsg = error.error?.errorMessage || error.message || 'Failed to load categories';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
      }
    });
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.product = response.result;
          this.infoForm.patchValue({
            name: this.product.name,
            image: this.product.image || '',
            productType: this.product.productType,
            categoryId: this.product.categoryId,
            description: this.product.description || '',
            lastModifiedDate: new Date().toISOString()
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: response.errorMessage || 'Failed to load product'
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: 'An error occurred while loading the product'
        });
        this.loading = false;
      }
    });
  }

  get f() {
    return this.infoForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.infoForm.invalid) {
      return;
    }

    this.loading = true;
    const productInfo = {
      name: this.infoForm.value.name,
      image: this.infoForm.value.image,
      categoryId: this.infoForm.value.categoryId,
      description: this.infoForm.value.description,
      productType: Number(this.infoForm.value.productType),
      lastModifiedDate: this.infoForm.value.lastModifiedDate
    };

    this.productService.editInformation(this.productId, productInfo).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
            this.router.navigate(['/admin/product']);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: response.errorMessage || 'Failed to update product information'
          });
          this.loading = false;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: error.error?.errorMessage || 'An error occurred while updating product information'
        });
        this.loading = false;
      }
    });
  }
}