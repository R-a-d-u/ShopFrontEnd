import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-generator',
  template: `<button class="download-button" (click)="downloadPDF()">⇩ Download PDF</button>`,
  styleUrls: ['./pdf-generator.component.css'],
})
export class PdfGeneratorComponent {
  @Input() elementId!: string; // Element to capture
  @Input() fileName: string = 'order-details.pdf'; // Default file name

  downloadPDF(): void {
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
        orderItems.forEach(item => {
          const productName = item.querySelector('.product-name')?.textContent?.trim() || 'Unknown Product';
          const quantity = item.querySelector('.order-item-quantity')?.textContent?.trim() || 'Qty: 0';
          const price = item.querySelector('.item-price')?.textContent?.trim() || '$0.00';


            // Replace content with inline format (without removing images first)
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
