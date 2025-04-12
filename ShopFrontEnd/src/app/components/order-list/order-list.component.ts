// order-list.component.ts - fixed version
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderService } from '../../services/order.service';
import { OrderDto } from '../../models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class OrderListComponent implements OnInit {
  orders: OrderDto[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  currentPage: number = 1;
  totalPages: number = 1;

  selectedSearchOption: string = 'created';
  searchOptions = [
    { label: 'Created Orders', value: 'created' },
    { label: 'Processing Orders', value: 'processing' },
    { label: 'Shipped Orders', value: 'shipped' },
    { label: 'Delivered Orders', value: 'delivered' },
    { label: 'Returned Orders', value: 'returned' },
    { label: 'Cancelled Orders', value: 'cancelled' },
  ];

  searchUserId: number | null = null;

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
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = null;
    
    let request;
    
    switch (this.selectedSearchOption) {
      case 'created':
        request = this.orderService.getAllOrdersByStatus(1, this.currentPage); // Assuming 'Created' status=1 is pending
        break;
      case 'processing':
        request = this.orderService.getAllOrdersByStatus(2, this.currentPage); // Assuming 'Delivered' status=4 is completed
        break;
      case 'shipped':
          request = this.orderService.getAllOrdersByStatus(3, this.currentPage); // Assuming 'Delivered' status=4 is completed
          break;
      case 'delivered':
          request = this.orderService.getAllOrdersByStatus(4, this.currentPage); // Assuming 'Delivered' status=4 is completed
          break;
      case 'returned':
          request = this.orderService.getAllOrdersByStatus(5, this.currentPage); // Assuming 'Delivered' status=4 is completed
          break;  
      case 'cancelled':
          request = this.orderService.getAllOrdersByStatus(6, this.currentPage); // Assuming 'Delivered' status=4 is completed
          break;      
      default:
        request = this.orderService.getAllOrdersByStatus(1, this.currentPage);
    }

    request.subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.orders = response.result.items;
          this.totalPages = response.result.totalPages;
          this.currentPage = response.result.pageNumber;
          this.errorMessage = null;
        } else {
          this.errorMessage = response.errorMessage || 'Failed to load orders';
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

  onSearchOptionChange(): void {
    this.currentPage = 1;
    this.searchUserId = null;
    this.loadOrders();
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
    this.router.navigate(['/admin']);
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
    this.router.navigate(['/admin/order/details', orderId]);
  }

  updateOrderStatus(orderId: string, newStatus: number): void {
    // Placeholder for update order status functionality
    this.confirmationService.confirm({
      message: `Are you sure you want to update this order's status?`,
      header: 'Confirm Status Update',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Call your service method here to update the order status
        this.messageService.add({
          severity: 'success',
          summary: 'Order Updated',
          detail: `Order status has been updated`
        });
        this.loadOrders();
      }
    });
  }
}