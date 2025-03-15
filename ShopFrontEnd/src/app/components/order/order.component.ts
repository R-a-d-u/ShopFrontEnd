import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderDto } from '../../models/order.model';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order: OrderDto | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        this.fetchOrderDetails(orderId);
      }
    });
  }

  fetchOrderDetails(orderId: string): void {
    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (data) => {
        // Check if current user is allowed to view this order
        const currentUser = this.authService.currentUserValue;
        if (currentUser && (this.authService.isAdmin() || data.userId === currentUser.id)) {
          this.order = data;
          this.loading = false;
        } else {
          // Not authorized to view this order
          this.router.navigate(['/unauthorized']);
        }
      },
      error: (err) => {
        this.error = err.message || 'Failed to load order details';
        this.loading = false;
      }
    });
  }
  

  getPaymentMethodName(method: number): string {
    switch (method) {
      case 1: return 'Cash On Delivery';
      case 2: return 'Credit Card';
      default: return 'Unknown';
    }
  }

  getOrderStatusName(status: number): string {
    switch (status) {
      case 1: return 'Created';
      case 2: return 'Processing';
      case 3: return 'Shipping';
      case 4: return 'Delivered';
      case 5: return 'Returned';
      case 6: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getOrderStatusClass(status: number): string {
    switch (status) {
      case 1: return 'Created';
      case 2: return 'Processing';
      case 3: return 'Shipping';
      case 4: return 'Delivered';
      case 5: return 'Returned';
      case 6: return 'Cancelled';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("en-US", { 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: false 
    });
  }
}

