// customer-order-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderService } from '../../services/order.service';
import { OrderDto } from '../../models/order.model';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CustomerOrderListComponent implements OnInit {
  orders: OrderDto[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  userId: number = 0;

  currentPage: number = 1;
  totalPages: number = 1;

  orderStatusTypes: Record<number, string> = {
    1: 'Created',
    2: 'Processing',
    3: 'Shipped',
    4: 'Delivered',
    5: 'Returned',
    6: 'Cancelled'
  };

  paymentMethodTypes: Record<number, string> = {
    1: 'CashOnDelivery',
    2: 'CreditCard',
  };

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
     private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Match the same parameter name 'id' as in user-view-analytics
      if (this.userId) {
        this.loadOrders();
      } else {
        this.errorMessage = 'Invalid user ID';
        this.loading = false;
      }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.orderService.getOrdersByUserId(this.userId, this.currentPage).subscribe({
      next: (response) => {
        if (response) {
          this.orders = response.items;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
          this.errorMessage = null;
        } else {
          this.errorMessage = 'Failed to load orders';
          this.orders = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred while loading orders';
        this.loading = false;
        this.orders = [];
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/customer']);
  }

  getOrderStatusName(statusType: number): string {
    return this.orderStatusTypes[statusType] || 'Unknown';
  }

  getPaymentMethodName(paymentMethod: number): string {
    return this.paymentMethodTypes[paymentMethod] || 'Unknown';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/admin/customer/order', orderId]);
  }
  updateToProcessing(orderId: string): void {
    this.confirmUpdateStatus(orderId, 'Processing', () => {
      this.orderService.updateStatusToProcessing(orderId).subscribe({
        next: (response) => this.handleStatusUpdateResponse(response, 'Processing'),
        error: (error) => this.handleStatusUpdateError(error)
      });
    });
  }

  updateToShipping(orderId: string): void {
    this.confirmUpdateStatus(orderId, 'Shipping', () => {
      this.orderService.updateStatusToShipping(orderId).subscribe({
        next: (response) => this.handleStatusUpdateResponse(response, 'Shipping'),
        error: (error) => this.handleStatusUpdateError(error)
      });
    });
  }

  updateToDelivered(orderId: string): void {
    this.confirmUpdateStatus(orderId, 'Delivered', () => {
      this.orderService.updateStatusToDelivered(orderId).subscribe({
        next: (response) => this.handleStatusUpdateResponse(response, 'Delivered'),
        error: (error) => this.handleStatusUpdateError(error)
      });
    });
  }

  updateToReturned(orderId: string): void {
    this.confirmUpdateStatus(orderId, 'Returned', () => {
      this.orderService.updateStatusToReturned(orderId).subscribe({
        next: (response) => this.handleStatusUpdateResponse(response, 'Returned'),
        error: (error) => this.handleStatusUpdateError(error)
      });
    });
  }

  updateToCanceled(orderId: string): void {
    this.confirmUpdateStatus(orderId, 'Canceled', () => {
      this.orderService.updateStatusToCanceled(orderId).subscribe({
        next: (response) => this.handleStatusUpdateResponse(response, 'Canceled'),
        error: (error) => this.handleStatusUpdateError(error)
      });
    });
  }

  // Helper methods for status updates
  private confirmUpdateStatus(orderId: string, statusName: string, callback: () => void): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to update this order's status to ${statusName}?`,
      header: 'Confirm Status Update',
      icon: 'pi pi-exclamation-triangle',
      accept: callback
    });
  }

  private handleStatusUpdateResponse(response: any, statusName: string): void {
    if (response && response.isSuccess) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Order Updated',
        detail: `Order status has been updated to ${statusName}`
      });
      this.loadOrders();
    } else {
      this.messageService.add({
        severity: 'danger',
        summary: 'Update Failed',
        detail: response.errorMessage || `Failed to update order status to ${statusName}`
      });
    }
  }

  private handleStatusUpdateError(error: any): void {
    this.messageService.add({
      severity: 'danger',
      summary: 'Update Failed',
      detail: error.message || 'An error occurred while updating the order status'
    });
  }
}