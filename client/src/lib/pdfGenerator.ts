import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Invoice, InvoiceItem } from "./types";
import { formatCurrency } from "./invoiceUtils";

// Helper function to add styled text to PDF
function addStyledText(
  pdf: jsPDF, 
  text: string, 
  x: number, 
  y: number, 
  options: { 
    fontSize?: number, 
    fontStyle?: string, 
    color?: [number, number, number], 
    align?: string 
  } = {}
) {
  const { fontSize = 12, fontStyle = 'normal', color = [0, 0, 0], align = 'left' } = options;
  pdf.setFontSize(fontSize);
  pdf.setTextColor(color[0], color[1], color[2]);
  pdf.setFont("helvetica", fontStyle);
  pdf.text(text, x, y, { align: align as any });
}

// Generate a professional, custom-designed PDF for SavannahPrime Agency
export async function generatePdf(invoice: Invoice): Promise<void> {
  try {
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    // SavannahPrime brand colors (in RGB format)
    const primaryColor: [number, number, number] = [41, 82, 156]; // Dark blue (converted from hex)
    const accentColor: [number, number, number] = [100, 100, 100]; // Dark gray
    
    // HEADER SECTION
    // Add company logo if available
    if (invoice.companyLogo) {
      try {
        // Add logo to PDF - positioned at top center
        const logoWidth = 40;
        const logoHeight = 20;
        const logoX = (pageWidth - logoWidth) / 2;
        pdf.addImage(invoice.companyLogo, 'JPEG', logoX, margin, logoWidth, logoHeight);
      } catch (logoError) {
        console.error("Error adding logo to PDF:", logoError);
        // If logo adding fails, add a text fallback
        addStyledText(pdf, "SAVANNAHPRIME AGENCY", pageWidth / 2, margin + 10, { 
          fontSize: 18, 
          fontStyle: 'bold', 
          color: primaryColor as [number, number, number],
          align: 'center'
        });
      }
    } else {
      // If no logo, add text header
      addStyledText(pdf, "SAVANNAHPRIME AGENCY", pageWidth / 2, margin + 10, { 
        fontSize: 18, 
        fontStyle: 'bold', 
        color: primaryColor as [number, number, number],
        align: 'center'
      });
    }
    
    // DOCUMENT TYPE & NUMBER
    const yPosition = invoice.companyLogo ? margin + 30 : margin + 20;
    const documentTitle = invoice.isQuotation ? "QUOTATION" : "INVOICE";
    addStyledText(pdf, documentTitle, pageWidth / 2, yPosition, { 
      fontSize: 16, 
      fontStyle: 'bold', 
      color: primaryColor as [number, number, number],
      align: 'center'
    });
    
    addStyledText(pdf, `#${invoice.invoiceNumber}`, pageWidth / 2, yPosition + 8, { 
      fontSize: 12, 
      color: accentColor as [number, number, number],
      align: 'center'
    });
    
    // COMPANY AND CLIENT INFO SECTION (two columns)
    let currentY = yPosition + 25;
    
    // Draw a subtle divider
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, currentY - 5, pageWidth - margin, currentY - 5);
    
    // From (Company) information - Left column
    addStyledText(pdf, "FROM:", margin, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, invoice.companyName, margin, currentY + 6, { fontSize: 11, fontStyle: 'bold' });
    
    // Add complete company information with icons
    let companyYOffset = currentY + 12;
    
    // Add company address with line breaks
    if (invoice.companyAddress) {
      const addressLines = invoice.companyAddress.split('\n');
      addressLines.forEach((line, index) => {
        addStyledText(pdf, `📍 ${line.trim()}`, margin, companyYOffset + (index * 5), { fontSize: 9 });
      });
      companyYOffset += (addressLines.length * 5);
    }
    
    // Add company contact information
    if (invoice.companyEmail) {
      companyYOffset += 5;
      addStyledText(pdf, `✉️ ${invoice.companyEmail}`, margin, companyYOffset, { fontSize: 9 });
    }
    
    if (invoice.paymentInstructions) {
      companyYOffset += 5;
      addStyledText(pdf, "Payment Details:", margin, companyYOffset, { fontSize: 9, fontStyle: 'bold' });
      companyYOffset += 5;
      const paymentLines = invoice.paymentInstructions.split('\n');
      paymentLines.forEach((line, index) => {
        addStyledText(pdf, `💳 ${line.trim()}`, margin, companyYOffset + (index * 5), { fontSize: 9 });
      });
    }
    
    // To (Client) information - Right column
    const clientColX = pageWidth / 2;
    addStyledText(pdf, "TO:", clientColX, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, invoice.clientName, clientColX, currentY + 6, { fontSize: 11, fontStyle: 'bold' });
    
    // Add complete client information
    let clientYOffset = currentY + 12;
    
    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split('\n');
      addressLines.forEach((line, index) => {
        addStyledText(pdf, `📍 ${line.trim()}`, clientColX, clientYOffset + (index * 5), { fontSize: 9 });
      });
      clientYOffset += (addressLines.length * 5);
    }
    
    if (invoice.clientEmail) {
      clientYOffset += 5;
      addStyledText(pdf, `✉️ ${invoice.clientEmail}`, clientColX, clientYOffset, { fontSize: 9 });
    }
    
    // Add client address with line breaks
    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split('\n');
      addressLines.forEach((line, index) => {
        addStyledText(pdf, line.trim(), clientColX, currentY + 12 + (index * 5), { fontSize: 9 });
      });
    }
    
    // Add client email
    if (invoice.clientEmail) {
      const addressLineCount = invoice.clientAddress ? invoice.clientAddress.split('\n').length : 0;
      addStyledText(pdf, invoice.clientEmail, clientColX, currentY + 12 + (addressLineCount * 5) + 5, { fontSize: 9 });
    }
    
    // DATES AND PAYMENT INFO SECTION
    // Calculate the maximum height of company/client information to determine where to place the next section
    const maxAddressLines = Math.max(
      invoice.companyAddress ? invoice.companyAddress.split('\n').length : 0,
      invoice.clientAddress ? invoice.clientAddress.split('\n').length : 0
    );
    
    currentY += 40 + (maxAddressLines * 5);
    
    // Draw a subtle divider
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, currentY - 5, pageWidth - margin, currentY - 5);
    
    // Issue Date & Due Date - Left column
    addStyledText(pdf, "DATE ISSUED:", margin, currentY, { fontSize: 9, fontStyle: 'bold' });
    const dateStr = invoice.date ? new Date(invoice.date).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    }) : '';
    addStyledText(pdf, dateStr, margin + 25, currentY, { fontSize: 9 });
    
    if (invoice.dueDate && !invoice.isQuotation) {
      addStyledText(pdf, "DUE DATE:", margin, currentY + 6, { fontSize: 9, fontStyle: 'bold' });
      const dueDateStr = new Date(invoice.dueDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      addStyledText(pdf, dueDateStr, margin + 25, currentY + 6, { fontSize: 9 });
    }
    
    // Payment Terms & Method - Right column
    if (!invoice.isQuotation) {
      addStyledText(pdf, "PAYMENT TERMS:", clientColX, currentY, { fontSize: 9, fontStyle: 'bold' });
      addStyledText(pdf, invoice.paymentTerms || "Net 30", clientColX + 35, currentY, { fontSize: 9 });
      
      addStyledText(pdf, "PAYMENT METHOD:", clientColX, currentY + 6, { fontSize: 9, fontStyle: 'bold' });
      addStyledText(pdf, invoice.paymentMethod || "Bank Transfer", clientColX + 35, currentY + 6, { fontSize: 9 });
    }
    
    // ITEMS SECTION
    currentY += 20;
    
    // Table headers
    const colWidths = {
      description: contentWidth * 0.5,
      quantity: contentWidth * 0.15,
      unitPrice: contentWidth * 0.15,
      amount: contentWidth * 0.2,
    };
    
    const colPositions = {
      description: margin,
      quantity: margin + colWidths.description,
      unitPrice: margin + colWidths.description + colWidths.quantity,
      amount: margin + colWidths.description + colWidths.quantity + colWidths.unitPrice,
    };
    
    // Add table header background
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(margin, currentY, contentWidth, 8, 'F');
    
    // Add table headers
    addStyledText(pdf, "DESCRIPTION", colPositions.description + 2, currentY + 5.5, { 
      fontSize: 9, 
      fontStyle: 'bold', 
      color: [255, 255, 255] 
    });
    addStyledText(pdf, "QTY", colPositions.quantity + 2, currentY + 5.5, { 
      fontSize: 9, 
      fontStyle: 'bold', 
      color: [255, 255, 255] 
    });
    addStyledText(pdf, "UNIT PRICE", colPositions.unitPrice + 2, currentY + 5.5, { 
      fontSize: 9, 
      fontStyle: 'bold', 
      color: [255, 255, 255] 
    });
    addStyledText(pdf, "AMOUNT", colPositions.amount + 2, currentY + 5.5, { 
      fontSize: 9, 
      fontStyle: 'bold', 
      color: [255, 255, 255] 
    });
    
    // Add items
    currentY += 10;
    let rowHeight = 12;
    
    // Draw table rows
    let altRow = false;
    invoice.items.forEach((item: InvoiceItem, index: number) => {
      // Add alternating row background for better readability
      if (altRow) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, currentY - 4, contentWidth, rowHeight, 'F');
      }
      altRow = !altRow;
      
      // Add item details
      addStyledText(pdf, item.description, colPositions.description + 2, currentY, { fontSize: 9 });
      addStyledText(pdf, item.quantity.toString(), colPositions.quantity + 2, currentY, { fontSize: 9 });
      addStyledText(pdf, formatCurrency(item.unitPrice), colPositions.unitPrice + 2, currentY, { fontSize: 9 });
      addStyledText(pdf, formatCurrency(item.amount), colPositions.amount + 2, currentY, { fontSize: 9 });
      
      currentY += rowHeight;
    });
    
    // Add a line at the bottom of the items table
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.3);
    pdf.line(margin, currentY - 4, pageWidth - margin, currentY - 4);
    
    // TOTALS SECTION
    const totalsWidth = 80;
    const totalsX = pageWidth - margin - totalsWidth;
    
    // Subtotal
    addStyledText(pdf, "Subtotal:", totalsX, currentY + 4, { fontSize: 9, fontStyle: 'bold' });
    addStyledText(pdf, formatCurrency(parseFloat(invoice.subtotal)), pageWidth - margin, currentY + 4, { 
      fontSize: 9, 
      align: 'right' 
    });
    
    // Add discount if applicable
    if (invoice.discount && parseFloat(invoice.discount) > 0) {
      currentY += 6;
      addStyledText(pdf, `Discount (${invoice.discount}%):`, totalsX, currentY + 4, { 
        fontSize: 9, 
        fontStyle: 'bold' 
      });
      addStyledText(pdf, `-${formatCurrency(parseFloat(invoice.discountAmount || "0"))}`, pageWidth - margin, currentY + 4, { 
        fontSize: 9, 
        align: 'right' 
      });
    }
    
    // Add tax if applicable
    if (invoice.taxRate && parseFloat(invoice.taxRate) > 0) {
      currentY += 6;
      addStyledText(pdf, `Tax (${invoice.taxRate}%):`, totalsX, currentY + 4, { 
        fontSize: 9, 
        fontStyle: 'bold' 
      });
      addStyledText(pdf, formatCurrency(parseFloat(invoice.taxAmount || "0")), pageWidth - margin, currentY + 4, { 
        fontSize: 9, 
        align: 'right' 
      });
    }
    
    // Total
    currentY += 8;
    // Add total background
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(totalsX - 4, currentY, totalsWidth + 4, 10, 'F');
    
    addStyledText(pdf, "TOTAL:", totalsX, currentY + 6.5, { 
      fontSize: 10, 
      fontStyle: 'bold',
      color: [255, 255, 255] 
    });
    addStyledText(pdf, formatCurrency(parseFloat(invoice.total)), pageWidth - margin - 4, currentY + 6.5, { 
      fontSize: 10, 
      fontStyle: 'bold',
      color: [255, 255, 255],
      align: 'right' 
    });
    
    // NOTES SECTION
    if (invoice.notes) {
      currentY += 20;
      addStyledText(pdf, "NOTES:", margin, currentY, { fontSize: 10, fontStyle: 'bold' });
      
      currentY += 6;
      const splitNotes = pdf.splitTextToSize(invoice.notes, contentWidth);
      addStyledText(pdf, splitNotes.join('\n'), margin, currentY, { fontSize: 9 });
    }
    
    // PAYMENT INSTRUCTIONS
    if (!invoice.isQuotation) {
      currentY += 20;
      addStyledText(pdf, "PAYMENT DETAILS:", margin, currentY, { 
        fontSize: 10, 
        fontStyle: 'bold' 
      });
      
      currentY += 6;
      if (invoice.paymentMethod === 'M-PESA') {
        addStyledText(pdf, "M-PESA Payment:", margin, currentY, { fontSize: 9, fontStyle: 'bold' });
        currentY += 5;
        addStyledText(pdf, `Pay Bill Number: ${invoice.paymentInstructions?.split('\n')[0] || ''}`, margin, currentY, { fontSize: 9 });
      } else {
        const splitInstructions = pdf.splitTextToSize(invoice.paymentInstructions || '', contentWidth);
        addStyledText(pdf, splitInstructions.join('\n'), margin, currentY, { fontSize: 9 });
      }
    }
    
    // SIGNATURE SECTION
    if (invoice.signatureData) {
      currentY += 25;
      
      // Add signature image
      try {
        const sigWidth = 50;
        const sigHeight = 20;
        pdf.addImage(invoice.signatureData, 'PNG', margin, currentY, sigWidth, sigHeight);
        
        // Add signature line
        pdf.setDrawColor(150, 150, 150);
        pdf.setLineWidth(0.2);
        pdf.line(margin, currentY + sigHeight + 4, margin + 80, currentY + sigHeight + 4);
        
        // Add signature text and signee name
        addStyledText(pdf, invoice.signeeName || "Authorized Signature", margin, currentY + sigHeight + 10, { 
          fontSize: 8, 
          color: [100, 100, 100] 
        });
        addStyledText(pdf, "Authorized Signatory", margin, currentY + sigHeight + 16, { 
          fontSize: 7, 
          color: [130, 130, 130] 
        });
      } catch (sigError) {
        console.error("Error adding signature to PDF:", sigError);
      }
    }
    
    // FOOTER
    const footerY = pageHeight - 10;
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    addStyledText(pdf, "Thank you for your business", pageWidth / 2, footerY, { 
      fontSize: 9, 
      color: primaryColor as [number, number, number],
      align: 'center'
    });
    
    // Generate filename
    const filename = invoice.isQuotation
      ? `SavannahPrime_Quotation_${invoice.invoiceNumber}.pdf`
      : `SavannahPrime_Invoice_${invoice.invoiceNumber}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
