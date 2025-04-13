import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeUsers: number = 0;
  lowStockItems: number = 0;
  totalProducts: number = 0;
  pendingOrders: number = 0;
  isUserAdmin: boolean= false;
  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.isUserAdmin=this.authService.isAdmin()
    this.fetchDashboardData();

  }

  fetchDashboardData(): void {
    this.employeeService.getActiveUsers().subscribe(count => this.activeUsers = count);
    this.employeeService.getLowStockProducts().subscribe(count => this.lowStockItems = count);
    this.employeeService.getTotalProducts().subscribe(count => this.totalProducts = count);
    this.employeeService.getPendingOrders().subscribe(count => this.pendingOrders = count);
  }

  logout(): void {
    this.authService.logout();
  }
}
