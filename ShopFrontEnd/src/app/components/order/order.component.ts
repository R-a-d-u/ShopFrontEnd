import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderDto } from '../../models/order.model';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { User, UserService } from 'src/app/services/user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService
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
  downloadPDF(): void {
    const element = document.getElementById('order-pdf-container'); // Replace with the ID of your HTML element
    if (element) {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px'; // Move it off-screen
      tempContainer.style.fontFamily='Roboto';
      document.body.appendChild(tempContainer);
  
      // Add the title
      const title = document.createElement('h2');
      title.textContent = 'Luxury & Gold';
      title.style.textAlign = 'center'; // Center the title
      title.style.marginTop = '16px'; // Add some spacing
      title.style.fontFamily='Roboto';
      tempContainer.appendChild(title);
  
      // Clone the original content and append it to the temporary container
      const clonedElement = element.cloneNode(true);
      tempContainer.appendChild(clonedElement);
  
      // Render the temporary container
      html2canvas(tempContainer, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio
  
        const pageHeight = 297; // A4 height in mm
        let position = 0; // Initial position for the first page
  
        // Add the first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        position -= pageHeight; // Move the position for the next page
  
        // Add additional pages if the content is taller than one page
        while (position > -imgHeight) {
          pdf.addPage(); // Add a new page
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          position -= pageHeight; // Move the position for the next page
        }
  
        // Save the PDF
        pdf.save('order-details.pdf');
  
        // Clean up: Remove the temporary container
        document.body.removeChild(tempContainer);
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/my-orders']);
  }
}

