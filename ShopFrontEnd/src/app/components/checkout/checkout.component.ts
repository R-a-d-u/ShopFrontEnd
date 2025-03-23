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

  // Cart details
  cartId: number | null = null;
  subtotalPrice = 0;
  shippingPrice = 0;
  totalPrice = 0;

  // Enums for template access
  paymentMethodEnum = PaymentMethod;
  shippingTypeEnum = ShippingType;

  // For determining shipping method selection
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

  loadCartDetails(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Please log in to proceed with checkout';
      return;
    }

    this.loading = true;
    this.error = '';

    // Get cart ID
    this.cartService.getCartByUserId().subscribe({
      next: (cartId) => {
        this.cartId = cartId;

        // Get cart items
        this.cartService.getCartItems(cartId).subscribe({
          next: (items) => {
            this.cartItems = items;

            if (items.length === 0) {
              this.error = 'Your cart is empty. Please add items before checkout.';
              this.loading = false;
              return;
            }

            // Get shipping price
            this.cartService.getShippingPrice(cartId).subscribe({
              next: (shippingPrice) => {
                this.shippingPrice = shippingPrice;

                // Determine the selected shipping method based on price
                this.determineShippingMethod(shippingPrice);

                // Get total price
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
    // Find the shipping method that matches the price
    const method = this.shippingMethods.find(m => Math.abs(m.price - price) < 0.01);
    if (method) {
      this.selectedShippingMethod = method.type;
    } else {
      // Default to standard if no match found
      this.selectedShippingMethod = ShippingType.Standard;
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      // Mark all fields as touched to trigger validation messages
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

    // Concatenate address details
    const formValues = this.checkoutForm.value;
    const fullAddress = `${formValues.address}, ${formValues.city}, ${formValues.county}, ${formValues.zipCode}, ${formValues.country}`;

    // Convert payment method to enum value
    const paymentMethod = formValues.paymentMethod === 'credit' ? PaymentMethod.CreditCard : PaymentMethod.CashOnDelivery;

    // Create order
    this.orderService.createOrderFromCart(this.cartId, fullAddress, paymentMethod).subscribe({
      next: (result) => {
        this.success = 'Order placed successfully!';
        this.loading = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Navigate to order confirmation page
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2500);
      },
      error: (error) => {
        this.error = error.message || 'Failed to create order. Please try again.';
        this.loading = false;
      }
    });
  }
}
