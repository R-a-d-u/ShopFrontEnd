import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PdfDownloadService } from '../../services/pdf-download.service';

@Component({
  selector: 'app-pdf-generator',
  template: `<button class="download-button" [disabled]="isDisabled" (click)="downloadPDF()">
    {{ buttonText }}
  </button>`,
  styleUrls: ['./pdf-generator.component.css'],
})
export class PdfGeneratorComponent implements OnInit, OnDestroy {
  @Input() elementId!: string;
  @Input() fileName: string = 'order-details.pdf';
  
  isDisabled: boolean = false;
  buttonText: string = '⇩ Download PDF';
  private updateTimer: any;
  
  constructor(private pdfDownloadService: PdfDownloadService) {}
  
  ngOnInit(): void {
    this.updateButtonState();
    // Check status every second to update button state
    this.updateTimer = setInterval(() => this.updateButtonState(), 1000);
  }
  
  ngOnDestroy(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  }
  
  updateButtonState(): void {
    if (!this.pdfDownloadService.canDownload()) {
      this.isDisabled = true;
      const remainingTime = this.pdfDownloadService.getRemainingTime();
      this.buttonText = `Download timeout: ${remainingTime}s`;
    } else {
      this.isDisabled = false;
      this.buttonText = '⇩ Download PDF';
    }
  }

  downloadPDF(): void {
    if (!this.pdfDownloadService.canDownload()) {
      const remainingTime = this.pdfDownloadService.getRemainingTime();
      alert(`Please wait ${remainingTime} seconds before downloading another PDF.`);
      return;
    }
    
    this.pdfDownloadService.setLastDownloadTime();
    this.updateButtonState();
    
    const element = document.getElementById('order-pdf-container'); 
    if (element) {
        // Create a temporary container for PDF generation
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.fontFamily = 'Roboto';
        document.body.appendChild(tempContainer);

        // Add the title
        const title = document.createElement('h2');
        title.textContent = 'Luxury & Gold';
        title.style.textAlign = 'center';
        title.style.marginTop = '16px';
        title.style.fontFamily = 'Roboto';
        tempContainer.appendChild(title);

        // Clone the order container without modifying the original
        const clonedElement = element.cloneNode(true) as HTMLElement;

        // Remove images and modify order items format
        const orderItems = clonedElement.querySelectorAll('.order-item');

        const orderStatus = clonedElement.querySelector('.order-status');
        if (orderStatus) {
            orderStatus.remove();
        }
        orderItems.forEach(item => {
          const productName = item.querySelector('.product-name')?.textContent?.trim() || 'Unknown Product';
          const quantity = item.querySelector('.order-item-quantity')?.textContent?.trim() || 'Qty: 0';
          const price = item.querySelector('.item-price')?.textContent?.trim() || '$0.00';

          // Replace content with inline format
          item.innerHTML = `
              <span class="order-item-name">${productName}</span>
              <span class="order-item-quantity">${quantity}</span>
              <span class="item-price">${price}</span>
          `;
        });

        

        tempContainer.appendChild(clonedElement);

        // Render the temporary container
        html2canvas(tempContainer, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); 
            const imgWidth = 210; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width; 

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('Luxury&Gold-order.pdf');

            // Cleanup
            document.body.removeChild(tempContainer);
        });
    }
  }
}