import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CustomerListComponent implements OnInit {
  customers: User[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  currentPage: number = 1;
  totalPages: number = 1;

  showAuthDialog: boolean = false;
  currentUserId: number = 0;
  currentUserName: string = '';
  dialogHeader: string='';

  selectedSearchOption: string = 'all';
  searchOptions = [
    { label: 'All Customers', value: 'all' },
    { label: 'By Name', value: 'name' },
    { label: 'By Email', value: 'email' }
  ];

  searchName: string = '';
  searchEmail: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.errorMessage = null;

    let request;

    switch (this.selectedSearchOption) {
      case 'all':
        request = this.userService.getAllCustomers(this.currentPage);
        break;
      case 'name':
        if (this.searchName) {
          request = this.userService.getUsersByName(this.searchName, this.currentPage);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please enter a search term'
          });
          this.loading = false;
          return;
        }
        break;
      case 'email':
        if (this.searchEmail) {
          request = this.userService.getUsersByEmail(this.searchEmail, this.currentPage);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please enter a search term'
          });
          this.loading = false;
          return;
        }
        break;
      default:
        request = this.userService.getAllCustomers(this.currentPage);
    }

    request.subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.customers = response.result.items.filter(customer => customer.userAccessType == 1);
          this.totalPages = response.result.totalPages;
          this.currentPage = response.result.pageNumber;
          this.errorMessage = null;
        } else {
          this.errorMessage = response.errorMessage;
          this.customers = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || 'An error occurred while loading customers';
        this.loading = false;
        this.customers = [];
      }
    });
  }

  onSearchOptionChange(): void {
    this.currentPage = 1;
    this.searchName = '';
    this.searchEmail = '';
    this.loadCustomers();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCustomers();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCustomers();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  viewCustomerStatistics(customerId: number): void {
    this.router.navigate(['/admin/customer/details/', customerId]);
  }

  viewCustomerOrders(customerId: number): void {
    this.router.navigate(['/admin/customer/orders/', customerId]);
  }

  handleAuthSuccess(userId: number): void {
    // This method is kept for compatibility with auth dialog, but it's not used in this component
    console.log('Auth success for user:', userId);
  }
}