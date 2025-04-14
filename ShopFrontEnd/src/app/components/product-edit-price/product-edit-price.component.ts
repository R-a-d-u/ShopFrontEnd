import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { MessageService } from 'primeng/api';
import { GoldHistoryService } from 'src/app/services/gold-history.service';

@Component({
  selector: 'app-product-edit-price',
  templateUrl: './product-edit-price.component.html',
  styleUrls: ['./product-edit-price.component.css']
})
export class ProductEditPriceComponent implements OnInit {
  productId: number = 0;
  product: Product | null = null;
  priceForm: FormGroup;
  loading: boolean = true;
  submitted: boolean = false;
  currentGoldPrice: number = 0;

  showAuthDialog: boolean = false;
  dialogHeader: string = 'Price Change Confirmation';
  authMessage: string = 'Authentication required to update product pricing!';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private goldService: GoldHistoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.priceForm = this.fb.group({
      additionalValue: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [{ value: 0, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadGoldPrice();
      this.loadProduct();
    });

    // Watch for changes in additionalValue to update sellingPrice
    this.priceForm.get('additionalValue')?.valueChanges.subscribe(() => {
      this.calculateSellingPrice();
    });
  }

  loadGoldPrice(): void {
    this.goldService.getGoldPriceInGrams().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.currentGoldPrice = response.result;
          if (this.product) {
            this.calculateSellingPrice();
          }
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

  loadProduct(): void {
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.product = response.result;
          this.priceForm.patchValue({
            additionalValue: this.product.additionalValue
          });
          
          this.calculateSellingPrice();
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

  calculateSellingPrice(): void {
    if (!this.product) return;
    
    const goldWeight = this.product.goldWeightInGrams || 0;
    const additionalValue = this.priceForm.get('additionalValue')?.value || 0;
    const type = this.product.productType;

    let sellingPrice = (additionalValue + goldWeight * this.currentGoldPrice) * 1.4;

    this.priceForm.patchValue({ sellingPrice: sellingPrice }, { emitEvent: false });
    this.cdr.detectChanges();
  }

  get f() {
    return this.priceForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.priceForm.invalid) {
      return;
    }
    this.showAuthDialog = true;
  }
  handleAuthSuccess(productId: number): void {
    // Authentication was successful, proceed with the price update
    this.loading = true;
    const additionalValue = this.priceForm.value.additionalValue;

    this.productService.editPrice(this.productId, additionalValue).subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {        
            this.router.navigate(['/admin/product']);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: response.errorMessage || 'Failed to update product price'
          });
          this.loading = false;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: 'An error occurred while updating product price'
        });
        this.loading = false;
      }
    });
  }
}