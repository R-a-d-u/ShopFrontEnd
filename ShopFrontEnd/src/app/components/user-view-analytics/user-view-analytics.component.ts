// user-view-analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { StatisticsService } from '../../services/statistics.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-view-analytics',
  templateUrl: './user-view-analytics.component.html',
  styleUrls: ['./user-view-analytics.component.css']
})
export class UserViewAnalyticsComponent implements OnInit {
  currentUser: any = null;
  userStats: any = null;
  errorMessage: string | null = null;
  userId: number = 0;
  loading: boolean = true;
  statsLoading: boolean = false;

  constructor(
    private userService: UserService,
    private statisticsService: StatisticsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Convert string to number with the + operator
      this.loadUserData();
    });
  }

  loadUserData(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.isSuccess) {
          this.currentUser = response.result;
          this.getUserStatistics(this.userId);
        } else {
          this.errorMessage = response.errorMessage;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error connecting to the server. Please try again later.';
      }
    });
  }

  getUserStatistics(userId: number): void {
    this.statsLoading = true;
    
    this.statisticsService.getUserPurchasePatterns(userId).subscribe({
      next: (response) => {
        this.statsLoading = false;
        if (response.isSuccess) {
          this.userStats = response.result;
        } else {
          // Just store the API error message, don't treat this as a critical error
          // since the user data was loaded successfully
          this.userStats = null;
        }
      },
      error: (error) => {
        this.statsLoading = false;
        this.userStats = null;
      }
    });
  }

  refreshData(): void {
    this.loadUserData();
  }
  
  goBack(): void {
    this.router.navigate(['/admin/user']);
  }
}