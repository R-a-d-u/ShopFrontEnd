import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';



enum PaymentMethod {
  CashOnDelivery = 1,
  CreditCard = 2,
}

enum ShippingType {
  Standard = 1,
  Express = 2,
  Premium = 3
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  loading = false;
  error = '';
  success = '';

  cartId: number | null = null;
  subtotalPrice = 0;
  shippingPrice = 0;
  totalPrice = 0;
  imageLoadFailedMap: { [productId: number]: boolean } = {};

  paymentMethodEnum = PaymentMethod;
  shippingTypeEnum = ShippingType;

  shippingMethods = [
    { type: ShippingType.Standard, name: 'Standard Shipping', price: 100.00, duration: '5-7 business days using our reliable regular shipping service.' },
    { type: ShippingType.Express, name: 'Express Shipping', price: 50.00, duration: '2-3 business days with our expedited regular shipping service.' },
    { type: ShippingType.Premium, name: 'Overnight Shipping', price: 0.00, duration: 'Next business day with our ultra-secure priority shipping service.' }
  ];

  selectedShippingMethod: ShippingType = ShippingType.Standard;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      fullName: [''],
      email: [''],
      phone: [''],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      county: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['RO', [Validators.required]],
      paymentMethod: ['CashOnDelivery', [Validators.required]],
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
  }

  ngOnInit(): void {
    this.loadCartDetails();

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.checkoutForm.patchValue({
        fullName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phoneNumber
      });
    }
    this.checkoutForm.get('fullName')?.disable();
    this.checkoutForm.get('email')?.disable();
    this.checkoutForm.get('phone')?.disable();

    // Set validators for credit card fields when payment method is credit card
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardNumberControl = this.checkoutForm.get('cardNumber');
      const expiryDateControl = this.checkoutForm.get('expiryDate');
      const cvvControl = this.checkoutForm.get('cvv');

      if (method === 'credit') {
        cardNumberControl?.setValidators([Validators.required]);
        expiryDateControl?.setValidators([Validators.required]);
        cvvControl?.setValidators([Validators.required]);
      } else {
        cardNumberControl?.clearValidators();
        expiryDateControl?.clearValidators();
        cvvControl?.clearValidators();
      }

      cardNumberControl?.updateValueAndValidity();
      expiryDateControl?.updateValueAndValidity();
      cvvControl?.updateValueAndValidity();
    });
  }
  onImageError(productId: number): void {
    this.imageLoadFailedMap[productId] = true;
  }

  loadCartDetails(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Please log in to proceed with checkout';
      return;
    }

    this.loading = true;
    this.error = '';

    this.cartService.getCartByUserId().subscribe({
      next: (cartId) => {
        this.cartId = cartId;

        this.cartService.getCartItems(cartId).subscribe({
          next: (items) => {
            this.cartItems = items;

            if (items.length === 0) {
              this.error = 'Your cart is empty. Please add items before checkout.';
              this.loading = false;
              return;
            }

            this.cartService.getShippingPrice(cartId).subscribe({
              next: (shippingPrice) => {
                this.shippingPrice = shippingPrice;

                this.determineShippingMethod(shippingPrice);

                this.cartService.getCartTotal(cartId).subscribe({
                  next: (totalPrice) => {
                    this.subtotalPrice = totalPrice ;
                    this.totalPrice = totalPrice + this.shippingPrice;
                    this.loading = false;
                  },
                  error: (error) => {
                    this.error = error.message || 'Failed to get total price';
                    this.loading = false;
                  }
                });
              },
              error: (error) => {
                this.error = error.message || 'Failed to get shipping price';
                this.loading = false;
              }
            });
          },
          error: (error) => {
            this.error = error.message || 'Failed to load cart items';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.error = error.message || 'Failed to load cart';
        this.loading = false;
      }
    });
  }

  determineShippingMethod(price: number): void {
    const method = this.shippingMethods.find(m => Math.abs(m.price - price) < 0.01);
    if (method) {
      this.selectedShippingMethod = method.type;
    } else {
      this.selectedShippingMethod = ShippingType.Standard;
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.cartId) {
      this.error = 'Cart not found. Please try again.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formValues = this.checkoutForm.value;
    const fullAddress = `${formValues.address}, ${formValues.city}, ${formValues.county}, ${formValues.zipCode}, ${formValues.country}`;

    const paymentMethod = formValues.paymentMethod === 'credit' ? PaymentMethod.CreditCard : PaymentMethod.CashOnDelivery;

    this.orderService.createOrderFromCart(this.cartId, fullAddress, paymentMethod).subscribe({
      next: (result) => {
        this.success = 'Order placed successfully!';
        this.loading = false;
        this.cartService.resetCartCount();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          this.router.navigate(['/my-orders']);
        }, 2500);
      },
      error: (error) => {
        this.error = error.message || 'Failed to create order. Please try again.';
        this.loading = false;
      }
    });
  }
}
