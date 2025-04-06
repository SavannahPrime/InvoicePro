import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Invoice } from "./types";
import { formatCurrency } from "./invoiceUtils";

export async function generatePdf(invoice: Invoice): Promise<void> {
  try {
    // Get the document-form element
    const element = document.getElementById("document-form");
    if (!element) {
      throw new Error("Document form element not found");
    }

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Generate canvas from the HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for loading external images
      logging: false
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png");

    // PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate aspect ratio to fit the content
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    
    let imgWidth, imgHeight;
    
    if (canvasHeight > canvasWidth) {
      // Portrait orientation
      imgHeight = pdfHeight - 20; // 10mm margin
      imgWidth = imgHeight * ratio;
    } else {
      // Landscape orientation
      imgWidth = pdfWidth - 20; // 10mm margin
      imgHeight = imgWidth / ratio;
    }

    // If content is too big for one page, we'll handle it by scaling
    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight - 20;
      imgWidth = imgHeight * ratio;
    }

    // Calculate position to center content
    const x = (pdfWidth - imgWidth) / 2;
    const y = 10; // Top margin

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    // Generate filename
    const filename = invoice.isQuotation
      ? `quotation-${invoice.invoiceNumber}.pdf`
      : `invoice-${invoice.invoiceNumber}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
