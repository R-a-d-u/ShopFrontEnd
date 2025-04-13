import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderDto } from '../../models/order.model';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order: OrderDto | null = null;
  loading = true;
  error: string | null = null;
  user: User | null = null;  // Add user property
  currentUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService
  ) { this.currentUrl = this.router.url; }

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
          this.fetchUserInfo(data.userId);
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
  fetchUserInfo(userId: number): void {
    this.loading = true;  // Set loading to true while fetching user info
    this.userService.getUserById(userId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.user = response.result;  // Assign the user info to the user property
        } else {
          this.error = 'Failed to fetch user info';
        }
        this.loading = false;  // Set loading to false once the request is done
      },
      error: (err) => {
        console.error('Failed to fetch user info:', err);
        this.error = 'Failed to fetch user info';
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
  goBack(): void {
    this.router.navigate(['/my-orders']);

    if (this.currentUrl.startsWith('/admin/order')) {
      this.router.navigate(['/admin/order']);
    } else if (this.currentUrl.startsWith('/admin/customer/order')) {
      this.router.navigate(['/admin/customer']);
    }
    else {
      this.router.navigate(['/my-orders']);
    }
  }
  getURLName(): string {
    if (this.currentUrl.startsWith('/admin/order')) {
      return 'Order Management'
    }else if (this.currentUrl.startsWith('/admin/customer/order')) {
      return 'Customer Order Management'
    }
     else {
      return 'My Orders'
    }
  }
}

