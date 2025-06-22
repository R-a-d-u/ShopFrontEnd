import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { PagedResult } from '../../models/paged-result.model';
import { OrderDto } from '../../models/order.model';
import { finalize } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit{
  orders: OrderDto[] = [];
  loading = false;
  error = '';
  noOrders = false;
  
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }
  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  loadOrders(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Please log in to view your orders';
      return;
    }

    this.loading = true;
    this.error = '';
    this.noOrders = false;
    
    const userId = this.authService.currentUserValue?.id;
    if(!userId)
    {
      this.error = 'Please log in to view your orders';
      return;
    }
    
    this.orderService.getOrdersByUserId(userId, this.currentPage)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (pagedResult) => {
          this.orders = pagedResult.items;
          this.totalItems = pagedResult.totalItems;
          this.currentPage = pagedResult.pageNumber;
          this.pageSize = pagedResult.pageSize;
          this.totalPages = pagedResult.totalPages;
          this.noOrders = this.orders.length === 0;
        },
        error: (error) => {
          if (error.message === "No orders found for this user.") {
            this.noOrders = true;
          } else {
            this.error = error.message || 'Failed to load orders';
          }
        }
      });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  getOrderItemsCount(order: OrderDto): number {
    return order.orderItems ? order.orderItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  }
  

  getOrderStatusText(status: number): string {
    switch(status) {
      case 1: return 'Created';
      case 2: return 'Processing';
      case 3: return 'Shipping';
      case 4: return 'Delivered';
      case 5: return 'Returned';
      case 6: return 'Cancelled';
      default: return 'Unknown';
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

