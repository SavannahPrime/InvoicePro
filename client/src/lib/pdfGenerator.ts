import { jsPDF } from "jspdf";
import { Invoice, InvoiceItem } from "./types";
import { formatCurrency } from "./invoiceUtils";

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

export async function generatePdf(invoice: Invoice): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);

    // Header
    let currentY = margin;

    // Document number
    addStyledText(pdf, `#${invoice.invoiceNumber}`, pageWidth - margin, currentY, {
      fontSize: 14,
      align: 'right'
    });

    // Company Details - Left side
    currentY += 15;
    addStyledText(pdf, "FROM:", margin, currentY, { fontSize: 10, fontStyle: 'bold' });
    currentY += 8;
    addStyledText(pdf, invoice.companyName || "", margin, currentY, { fontSize: 12, fontStyle: 'bold' });

    if (invoice.companyAddress) {
      currentY += 6;
      const addressLines = invoice.companyAddress.split('\n');
      addressLines.forEach((line) => {
        addStyledText(pdf, line.trim(), margin, currentY, { fontSize: 10 });
        currentY += 5;
      });
    }

    if (invoice.companyEmail) {
      currentY += 2;
      addStyledText(pdf, invoice.companyEmail, margin, currentY, { fontSize: 10 });
    }

    // Client Details - Right side
    const rightColX = pageWidth / 2;
    currentY = 35;
    addStyledText(pdf, "TO:", rightColX, currentY, { fontSize: 10, fontStyle: 'bold' });
    currentY += 8;
    addStyledText(pdf, invoice.clientName || "", rightColX, currentY, { fontSize: 12, fontStyle: 'bold' });

    if (invoice.clientAddress) {
      currentY += 6;
      const addressLines = invoice.clientAddress.split('\n');
      addressLines.forEach((line) => {
        addStyledText(pdf, line.trim(), rightColX, currentY, { fontSize: 10 });
        currentY += 5;
      });
    }

    if (invoice.clientEmail) {
      currentY += 2;
      addStyledText(pdf, invoice.clientEmail, rightColX, currentY, { fontSize: 10 });
    }

    // Line Items Table
    currentY += 20;

    // Table Headers
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, currentY, contentWidth, 10, 'F');

    const colWidths = {
      description: contentWidth * 0.4,
      quantity: contentWidth * 0.2,
      unitPrice: contentWidth * 0.2,
      amount: contentWidth * 0.2
    };

    currentY += 7;
    addStyledText(pdf, "Description", margin, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, "Qty", margin + colWidths.description, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, "Unit Price", margin + colWidths.description + colWidths.quantity, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, "Amount", pageWidth - margin - 2, currentY, { fontSize: 10, fontStyle: 'bold', align: 'right' });

    // Table Rows
    currentY += 8;
    invoice.items.forEach((item: InvoiceItem) => {
      addStyledText(pdf, item.description, margin, currentY, { fontSize: 10 });
      addStyledText(pdf, item.quantity.toString(), margin + colWidths.description, currentY, { fontSize: 10 });
      addStyledText(pdf, formatCurrency(item.unitPrice), margin + colWidths.description + colWidths.quantity, currentY, { fontSize: 10 });
      addStyledText(pdf, formatCurrency(item.amount), pageWidth - margin - 2, currentY, { fontSize: 10, align: 'right' });
      currentY += 8;
    });

    // Totals Section
    currentY += 5;
    const totalsX = pageWidth - margin - 80;
    const totalsLabelX = pageWidth - margin - 80;
    const totalsValueX = pageWidth - margin - 2;

    addStyledText(pdf, "Subtotal:", totalsLabelX, currentY, { fontSize: 10 });
    addStyledText(pdf, formatCurrency(parseFloat(invoice.subtotal)), totalsValueX, currentY, { fontSize: 10, align: 'right' });

    if (invoice.taxRate && parseFloat(invoice.taxRate) > 0) {
      currentY += 6;
      addStyledText(pdf, `Tax (${invoice.taxRate}%):`, totalsLabelX, currentY, { fontSize: 10 });
      addStyledText(pdf, formatCurrency(parseFloat(invoice.taxAmount || "0")), totalsValueX, currentY, { fontSize: 10, align: 'right' });
    }

    if (invoice.discount && parseFloat(invoice.discount) > 0) {
      currentY += 6;
      addStyledText(pdf, `Discount (${invoice.discount}%):`, totalsLabelX, currentY, { fontSize: 10 });
      addStyledText(pdf, `-${formatCurrency(parseFloat(invoice.discountAmount || "0"))}`, totalsValueX, currentY, { fontSize: 10, align: 'right' });
    }

    // Total
    currentY += 8;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(totalsX - 5, currentY - 5, 85, 10, 'F');
    addStyledText(pdf, "Total:", totalsLabelX, currentY, { fontSize: 11, fontStyle: 'bold' });
    addStyledText(pdf, formatCurrency(parseFloat(invoice.total)), totalsValueX, currentY, { fontSize: 11, fontStyle: 'bold', align: 'right' });

    // Payment Information
    if (!invoice.isQuotation && invoice.paymentMethod) {
      currentY += 20;
      addStyledText(pdf, "Payment Information", margin, currentY, { fontSize: 11, fontStyle: 'bold' });
      currentY += 6;
      addStyledText(pdf, `Method: ${invoice.paymentMethod}`, margin, currentY, { fontSize: 10 });

      if (invoice.paymentInstructions) {
        currentY += 6;
        const instructions = invoice.paymentInstructions.split('\n');
        instructions.forEach((line) => {
          addStyledText(pdf, line.trim(), margin, currentY, { fontSize: 10 });
          currentY += 5;
        });
      }
    }

    // Notes
    if (invoice.notes) {
      currentY += 15;
      addStyledText(pdf, "Notes", margin, currentY, { fontSize: 11, fontStyle: 'bold' });
      currentY += 6;
      const notes = invoice.notes.split('\n');
      notes.forEach((line) => {
        addStyledText(pdf, line.trim(), margin, currentY, { fontSize: 10 });
        currentY += 5;
      });
    }

    // Signature
    if (invoice.signatureData) {
      currentY += 15;
      try {
        const sigWidth = 50;
        const sigHeight = 20;
        pdf.addImage(invoice.signatureData, 'PNG', margin, currentY, sigWidth, sigHeight);

        currentY += sigHeight + 5;
        pdf.setDrawColor(100, 100, 100);
        pdf.line(margin, currentY, margin + 80, currentY);

        currentY += 5;
        addStyledText(pdf, "Authorized Signature", margin, currentY, { fontSize: 8, color: [100, 100, 100] });
      } catch (error) {
        console.error("Error adding signature:", error);
      }
    }

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - margin;
    addStyledText(pdf, "Thank you for your business", pageWidth / 2, footerY, { 
      fontSize: 10, 
      align: 'center',
      color: [100, 100, 100]
    });

    // Save the PDF
    const filename = invoice.isQuotation
      ? `Quotation_${invoice.invoiceNumber}.pdf`
      : `Invoice_${invoice.invoiceNumber}.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}