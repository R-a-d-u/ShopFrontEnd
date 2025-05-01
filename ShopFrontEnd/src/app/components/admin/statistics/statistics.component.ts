import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../../services/statistics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  selectedAnalysisType: string = 'product';

  chartOptions: any = null;
  summaryData: any[] = [];

  loading: boolean = false;
  error: string | null = null;

  lastProductName: string = "";

  constructor(private statisticsService: StatisticsService,private router: Router) { }

  ngOnInit() {
    const now = new Date();
    const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate());
  
    this.startDate = this.formatDateTime(fourMonthsAgo);
  
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.endDate = this.formatDateTime(tomorrow);
  
    this.fetchStatistics();
  }

  formatDateTime(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  fetchStatistics(): void {
    this.selectedProductDetails = {};
    this.loading = true;
    this.error = null;
    this.chartOptions = null;
    this.summaryData = [];

    let statisticsObservable;

    switch (this.selectedAnalysisType) {
      case 'product':
        statisticsObservable = this.statisticsService.getProductSalesSummary(this.startDate, this.endDate);
        break;
      case 'revenue':
        statisticsObservable = this.statisticsService.getRevenueAnalysis(this.startDate, this.endDate);
        break;
      case 'category':
        statisticsObservable = this.statisticsService.getCategorySalesPerformance(this.startDate, this.endDate);
        break;
      case 'hourly':
        statisticsObservable = this.statisticsService.getHourlySalesSummary(this.startDate, this.endDate);
        break;
      default:
        this.loading = false;
        this.error = 'Invalid analysis type';
        return;
    }

    statisticsObservable.subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.processStatistics(response.result);
        } else {
          this.error = response.errorMessage || 'Failed to fetch statistics';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'An unexpected error occurred';
        this.loading = false;
      }
    });
  }

  processStatistics(data: any) {
    this.selectedProductDetails = {};
    switch (this.selectedAnalysisType) {
      case 'hourly':
        this.createHourlyChart(data);
        break;
      case 'product':
        this.createProductChart(data);
        break;
      case 'revenue':
        this.createRevenueSummary(data);
        break;
      case 'category':
        this.createCategoryChart(data);
        break;
    }
  }

  createHourlyChart(data: any[]) {
    this.chartOptions = {
      theme: "light2",
      zoomEnabled: true,
      animationEnabled: true,
      title: { text: "Hourly Sales Distribution" },
      axisX: { title: "Hour" },
      axisY: { title: "Sales (%)" },
      data: [{
        type: "column",
        dataPoints: data.map(item => ({
          label: item.hour,
          y: item.salesPercentage
        }))
      }]
    };
  }

  createProductChart(data: any[]) {
    this.chartOptions = {
      theme: "light2",
      zoomEnabled: true,
      animationEnabled: true,
      title: { text: "Product Sales Performance" },
      axisX: { title: "Product" },
      axisY: { title: "Sales (%)" },
      data: [{
        type: "pie",
        click: (e: { dataPoint: any; }) => {
          // Create a detailed view when a pie slice is clicked
          const selectedItem = e.dataPoint;
          this.selectedProductDetails = {
            productName: selectedItem.label,
            sellingPercentage: selectedItem.y,
            totalQuantitySold: selectedItem.totalQuantitySold,
            averagePrice: selectedItem.averagePrice
          };
          if (this.lastProductName == selectedItem.label)
           {
            this.selectedProductDetails = {};
            this.lastProductName="";
           }
          else
            this.lastProductName = selectedItem.label;

        },
        dataPoints: data.map(item => ({
          label: item.productName,
          y: item.sellingPercentage,
          totalQuantitySold: item.totalQuantitySold,
          averagePrice: item.averagePrice
        }))
      }]
    };
  }

  // Add this property to the component class
  selectedProductDetails: {
    productName?: string,
    sellingPercentage?: number,
    totalQuantitySold?: number,
    averagePrice?: number
  } = {};

  createRevenueSummary(data: any) {
    this.summaryData = [
      { title: 'Total Revenue', value: `$${data.totalRevenue.toFixed(2)}` },
      { title: 'Daily Avg Revenue', value: `$${data.dailyAverageRevenue.toFixed(2)}` },
      { title: 'Total Orders', value: data.totalOrderCount },
      { title: 'Average Order Value', value: `$${data.averageOrderValue.toFixed(2)}` },
      { title: 'Total Confirmed Customers', value: data.totalConfirmedClients },
      { title: 'New Customers in Period', value: data.newClientsInTimeframe }
    ];
  }

  createCategoryChart(data: any[]) {
    this.chartOptions = {
      theme: "light2",
      zoomEnabled: true,
      animationEnabled: true,
      title: { text: "Category Sales Performance" },
      axisX: { title: "Category" },
      axisY: { title: "Sales (%)" },
      data: [{
        type: "column",
        dataPoints: data.map(item => ({
          label: item.categoryName,
          y: item.salesPercentage
        }))
      }]
    };
  }


  // ... rest of the methods remain the same as in the previous implementation

  getChartInstance(chart: any) {
    // Optional chart instance handling
  }
  onAnalysisTypeChange(): void {
    // Only fetch if we have start and end dates
    if (this.startDate && this.endDate) {
      this.fetchStatistics();
    }
  }
  goBack() : void{
    this.router.navigate(['/admin']);
  }
}