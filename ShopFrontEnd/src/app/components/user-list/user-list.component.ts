import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  currentPage: number = 1;
  totalPages: number = 1;

  showAuthDialog: boolean = false;
  currentUserId: number = 0;
  currentUserName: string = '';
  dialogHeader: string='';

  selectedSearchOption: string = 'admins';
  searchOptions = [
    { label: 'All Admins', value: 'admins' },
    { label: 'All Employees', value: 'employees' },
    { label: 'All Customers', value: 'customers' },
    { label: 'By Name', value: 'name' },
    { label: 'By Email', value: 'email' }
  ];

  searchName: string = '';
  searchEmail: string = '';

  userAccessTypes: Record<number, string> = {
    1: 'Customer',
    2: 'Employee',
    3: 'Admin'
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = null;

    let request;

    switch (this.selectedSearchOption) {
      case 'admins':
        request = this.userService.getAllAdmins(this.currentPage);
        break;
      case 'employees':
        request = this.userService.getAllEmployees(this.currentPage);
        break;
      case 'customers':
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
        request = this.userService.getAllAdmins(this.currentPage);
    }

    request.subscribe({
      next: (response) => {
        if (response.isSuccess && response.result) {
          this.users = response.result.items;
          this.totalPages = response.result.totalPages;
          this.currentPage = response.result.pageNumber;
          this.errorMessage = null;
        } else {
          // Use the error message directly from the API response
          this.errorMessage = response.errorMessage;
          this.users = [];
        }
        this.loading = false;
      },
      error: (error) => {
        // Handle HTTP errors (like 500, 404, etc.)
        this.errorMessage = error.error?.errorMessage || 'An error occurred while loading users';
        this.loading = false;
        this.users = [];
      }
    });
  }

  onSearchOptionChange(): void {
    this.currentPage = 1;
    this.searchName = '';
    this.searchEmail = '';
    this.loadUsers();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  getUserAccessTypeName(accessType: number): string {
    return this.userAccessTypes[accessType] || 'Unknown';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  viewUserDetails(userId: number): void {
    // Placeholder for view user details functionality
    this.messageService.add({
      severity: 'info',
      summary: 'View User',
      detail: `Viewing user with ID: ${userId}`
    });
  }

  viewUserAnalytics(userId: number): void {
    // Placeholder for view analytics functionality
    this.messageService.add({
      severity: 'info',
      summary: 'User Analytics',
      detail: `Viewing analytics for user with ID: ${userId}`
    });
  }

  confirmSetAsAdmin(userId: number, userName: string): void {
    this.dialogHeader = "Confirm new role as admin!";
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.showAuthDialog = true;
  }

  confirmSetAsEmployee(userId: number, userName: string): void {
    this.dialogHeader="Confirm new role as employee!"
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.showAuthDialog = true;
  }
  deleteUser(userId: number, userName: string): void {
    this.dialogHeader = "Confirm user deletion!";
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.showAuthDialog = true;
  }

  handleAuthSuccess(userId: number): void {
    // Authentication was successful, proceed with the appropriate action
    if (this.dialogHeader === "Confirm new role as admin!") {
      this.userService.setUserAsAdmin(userId).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.messageService.add({
              severity: 'warn',
              summary: 'User Role Updated',
              detail: `User ${this.currentUserName} has been set as Admin`
            });
            this.loadUsers();
          } else {
            this.messageService.add({
              severity: 'danger',
              summary: 'Action Failed',
              detail: response.errorMessage || 'Failed to update user role'
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Action Failed',
            detail: 'An error occurred while updating user role'
          });
        }
      });
    } else if (this.dialogHeader === "Confirm new role as employee!") {
      this.userService.setUserAsEmployee(userId).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.messageService.add({
              severity: 'warn',
              summary: 'User Role Updated',
              detail: `User ${this.currentUserName} has been set as Employee`
            });
            this.loadUsers();
          } else {
            this.messageService.add({
              severity: 'danger',
              summary: 'Action Failed',
              detail: response.errorMessage || 'Failed to update user role'
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Action Failed',
            detail: 'An error occurred while updating user role'
          });
        }
      });
    } else if (this.dialogHeader === "Confirm user deletion!") {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.messageService.add({
              severity: 'warn',
              summary: 'User Deleted',
              detail: `User ${this.currentUserName} has been deleted`
            });
            this.loadUsers();
          } else {
            this.messageService.add({
              severity: 'danger',
              summary: 'Action Failed',
              detail: response.errorMessage || 'Failed to delete user'
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Action Failed',
            detail: 'An error occurred while deleting user'
          });
        }
      });
    }
  }
}