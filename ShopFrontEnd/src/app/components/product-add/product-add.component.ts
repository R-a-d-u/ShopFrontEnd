import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { MessageService } from 'primeng/api';
import { GoldHistoryService } from 'src/app/services/gold-history.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  submitted = false;
  categories: any[] = [];
  currentGoldPrice: number = 0;
  productTypes = [
    { id: 1, name: 'Jewelry' },
    { id: 2, name: 'Gold Coins' },
    { id: 3, name: 'Gold Bars' },
    { id: 4, name: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private goldService: GoldHistoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      productType: [1, Validators.required],
      categoryId: ['', Validators.required],
      additionalValue: [0, [Validators.required]],
      goldWeightInGrams: [0, [Validators.required]],
      sellingPrice: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [1, [Validators.required, Validators.min(1)]],
      image: [''],
      description: [''],
      lastModifiedDate: [new Date().toISOString(), [Validators.required, this.validateDateNotFuture]]
    });

    this.loadCategories();
    this.loadGoldPrice();
    this.setupPriceCalculations();
  }

  loadGoldPrice(): void {
    this.goldService.getGoldPriceInGrams().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.currentGoldPrice = response.result;
          this.calculateSellingPrice();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: response.errorMessage || 'Failed to get current gold price'
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.errorMessage || 'Failed to load gold price'
        });
      }
    });
  }
  validateSellingPrice(): void {
    const sellingPriceControl = this.productForm.get('sellingPrice');
    const sellingPrice = sellingPriceControl?.value;

    if (sellingPrice <= 0) {
      sellingPriceControl?.setErrors({ min: true });
      // Also mark the form as invalid
      this.productForm.setErrors({ invalidSellingPrice: true });
    } else {
      sellingPriceControl?.setErrors(null);
      // Clear any selling price errors from the form
      if (this.productForm.errors?.['invalidSellingPrice']) {
        const errors = { ...this.productForm.errors };
        delete errors['invalidSellingPrice'];
        this.productForm.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  setupPriceCalculations(): void {
    this.productForm.get('goldWeightInGrams')?.valueChanges.subscribe(() => this.calculateSellingPrice());
    this.productForm.get('additionalValue')?.valueChanges.subscribe(() => this.calculateSellingPrice());
    this.productForm.get('productType')?.valueChanges.subscribe(() => this.calculateSellingPrice());
  }

  calculateSellingPrice(): void {
    const goldWeight = this.productForm.get('goldWeightInGrams')?.value || 0;
    const additionalValue = this.productForm.get('additionalValue')?.value || 0;
    const type = this.productForm.get('productType')?.value;

    let sellingPrice = 0;

    sellingPrice = (additionalValue + goldWeight * this.currentGoldPrice) * 1.4;




    this.productForm.patchValue({ sellingPrice: sellingPrice }, { emitEvent: false });
    this.validateSellingPrice(); // Add validation after calculation
  }

  validateDateNotFuture(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate > today ? { futureDate: true } : null;
  }

  get f() {
    return this.productForm.controls;
  }

  loadCategories(): void {
    this.categoryService.getAllCategoryNames().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.categories.length > 0) {
          this.productForm.patchValue({ categoryId: this.categories[0].id });
        }
      },
      error: (error) => {
        const errorMsg = error.error?.errorMessage || error.message || 'Failed to load categories';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.validateSellingPrice(); // Add validation check before submit

    // Manually check selling price since the field is disabled
    const sellingPrice = this.productForm.get('sellingPrice')?.value;
    if (sellingPrice <= 0) {

      return;
    }

    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const productData = { 
      ...this.productForm.getRawValue(), 
      productType: Number(this.productForm.get('productType')?.value), // force number
      productState: 1 
    };

    this.productService.addProduct(productData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'warn', summary: 'Success', detail: 'Product added successfully!' });
        this.router.navigate(['/admin/product']);

      },
      error: (error) => {
        this.messageService.add({ severity: 'danger', summary: 'Error', detail: error.error?.errorMessage || 'Failed to add product' });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}