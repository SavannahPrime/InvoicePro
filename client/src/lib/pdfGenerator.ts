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

    // Header with logo if available
    let currentY = margin;
    if (invoice.companyLogo) {
      try {
        const logoWidth = 40;
        const logoHeight = 20;
        pdf.addImage(invoice.companyLogo, 'PNG', margin, currentY, logoWidth, logoHeight);
        currentY += logoHeight + 5;
      } catch (error) {
        console.error("Error adding logo:", error);
      }
    }

    // Document Title and Number
    addStyledText(pdf, invoice.isQuotation ? "QUOTATION" : "INVOICE", margin, currentY, {
      fontSize: 24,
      fontStyle: 'bold',
      color: [51, 51, 51]
    });
    addStyledText(pdf, `#${invoice.invoiceNumber}`, pageWidth - margin, currentY, {
      fontSize: 16,
      align: 'right',
      color: [51, 51, 51]
    });
    currentY += 15;

    // Company Details Section
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, currentY, contentWidth, 35, 'F');
    currentY += 8;

    addStyledText(pdf, "FROM:", margin + 5, currentY, { 
      fontSize: 10, 
      fontStyle: 'bold',
      color: [100, 100, 100]
    });

    currentY += 6;
    addStyledText(pdf, invoice.companyName || "", margin + 5, currentY, { 
      fontSize: 12, 
      fontStyle: 'bold' 
    });

    if (invoice.companyAddress) {
      currentY += 6;
      const addressLines = invoice.companyAddress.split('\n');
      addressLines.forEach((line) => {
        const cleanLine = line.trim().replace(/[^\x20-\x7E]/g, ''); // Remove non-printable characters
        addStyledText(pdf, `📍 ${cleanLine}`, margin + 5, currentY, { fontSize: 9 });
        currentY += 5;
      });
    }

    if (invoice.companyEmail) {
      currentY += 2;
      addStyledText(pdf, `✉️ ${invoice.companyEmail}`, margin + 5, currentY, { fontSize: 9 });
    }

    // Client Details Section
    currentY += 15;
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, currentY, contentWidth, 35, 'F');
    currentY += 8;

    addStyledText(pdf, "BILL TO:", margin + 5, currentY, { 
      fontSize: 10, 
      fontStyle: 'bold',
      color: [100, 100, 100]
    });

    currentY += 6;
    addStyledText(pdf, invoice.clientName || "", margin + 5, currentY, { 
      fontSize: 12, 
      fontStyle: 'bold' 
    });

    if (invoice.clientAddress) {
      currentY += 6;
      const addressLines = invoice.clientAddress.split('\n');
      addressLines.forEach((line) => {
        const cleanLine = line.trim().replace(/[^\x20-\x7E]/g, ''); // Remove non-printable characters
        addStyledText(pdf, `📍 ${cleanLine}`, margin + 5, currentY, { fontSize: 9 });
        currentY += 5;
      });
    }

    if (invoice.clientEmail) {
      currentY += 2;
      addStyledText(pdf, `✉️ ${invoice.clientEmail}`, margin + 5, currentY, { fontSize: 9 });
    }

    // Date Information
    currentY += 15;
    const dateCol1 = margin;
    const dateCol2 = pageWidth - margin - 80;

    addStyledText(pdf, "DATE ISSUED:", dateCol1, currentY, { 
      fontSize: 8,
      fontStyle: 'bold',
      color: [100, 100, 100]
    });
    addStyledText(pdf, invoice.date ? invoice.date.toLocaleDateString() : "", dateCol1, currentY + 5, { 
      fontSize: 10 
    });

    if (!invoice.isQuotation) {
      addStyledText(pdf, "DUE DATE:", dateCol2, currentY, { 
        fontSize: 8,
        fontStyle: 'bold',
        color: [100, 100, 100]
      });
      addStyledText(pdf, invoice.dueDate ? invoice.dueDate.toLocaleDateString() : "", dateCol2, currentY + 5, { 
        fontSize: 10 
      });
    }

    // Line Items Table
    currentY += 20;
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, currentY, contentWidth, 10, 'F');

    const colWidths = {
      description: contentWidth * 0.4,
      quantity: contentWidth * 0.2,
      unitPrice: contentWidth * 0.2,
      amount: contentWidth * 0.2
    };

    currentY += 7;
    addStyledText(pdf, "Description", margin + 5, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, "Qty", margin + colWidths.description, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, "Unit Price", margin + colWidths.description + colWidths.quantity, currentY, { fontSize: 10, fontStyle: 'bold' });
    addStyledText(pdf, "Amount", pageWidth - margin - 5, currentY, { fontSize: 10, fontStyle: 'bold', align: 'right' });

    // Table Rows
    currentY += 8;
    invoice.items.forEach((item: InvoiceItem, index: number) => {
      if (index % 2 === 0) {
        pdf.setFillColor(252, 252, 252);
        pdf.rect(margin, currentY - 4, contentWidth, 8, 'F');
      }

      addStyledText(pdf, item.description, margin + 5, currentY, { fontSize: 9 });
      addStyledText(pdf, item.quantity.toString(), margin + colWidths.description, currentY, { fontSize: 9 });
      addStyledText(pdf, formatCurrency(item.unitPrice), margin + colWidths.description + colWidths.quantity, currentY, { fontSize: 9 });
      addStyledText(pdf, formatCurrency(item.amount), pageWidth - margin - 5, currentY, { fontSize: 9, align: 'right' });
      currentY += 8;
    });

    // Totals Section
    currentY += 5;
    const totalsWidth = 150;
    const totalsX = pageWidth - margin - totalsWidth;

    pdf.setFillColor(249, 250, 251);
    pdf.rect(totalsX, currentY, totalsWidth, invoice.discount || invoice.taxRate ? 45 : 25, 'F');

    const totalLabelX = totalsX + 10;
    const totalValueX = pageWidth - margin - 5;

    addStyledText(pdf, "Subtotal:", totalLabelX, currentY + 6, { fontSize: 10 });
    addStyledText(pdf, formatCurrency(parseFloat(invoice.subtotal)), totalValueX, currentY + 6, { fontSize: 10, align: 'right' });

    if (invoice.taxRate && parseFloat(invoice.taxRate) > 0) {
      currentY += 8;
      addStyledText(pdf, `Tax (${invoice.taxRate}%):`, totalLabelX, currentY + 6, { fontSize: 10 });
      addStyledText(pdf, formatCurrency(parseFloat(invoice.taxAmount || "0")), totalValueX, currentY + 6, { fontSize: 10, align: 'right' });
    }

    if (invoice.discount && parseFloat(invoice.discount) > 0) {
      currentY += 8;
      addStyledText(pdf, `Discount (${invoice.discount}%):`, totalLabelX, currentY + 6, { fontSize: 10 });
      addStyledText(pdf, `-${formatCurrency(parseFloat(invoice.discountAmount || "0"))}`, totalValueX, currentY + 6, { fontSize: 10, align: 'right' });
    }

    currentY += 8;
    addStyledText(pdf, "Total:", totalLabelX, currentY + 6, { fontSize: 11, fontStyle: 'bold' });
    addStyledText(pdf, formatCurrency(parseFloat(invoice.total)), totalValueX, currentY + 6, { fontSize: 11, fontStyle: 'bold', align: 'right' });

    // Payment Information
    if (!invoice.isQuotation && invoice.paymentMethod) {
      currentY += 25;
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, currentY, contentWidth, 25, 'F');

      currentY += 6;
      addStyledText(pdf, "Payment Information", margin + 5, currentY, { fontSize: 10, fontStyle: 'bold' });
      currentY += 6;
      addStyledText(pdf, `Method: ${invoice.paymentMethod}`, margin + 5, currentY, { fontSize: 9 });

      if (invoice.paymentInstructions) {
        currentY += 6;
        addStyledText(pdf, invoice.paymentInstructions, margin + 5, currentY, { fontSize: 9 });
      }
    }

    // Notes
    if (invoice.notes) {
      currentY += 20;
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, currentY, contentWidth, 25, 'F');

      currentY += 6;
      addStyledText(pdf, "Notes", margin + 5, currentY, { fontSize: 10, fontStyle: 'bold' });
      currentY += 6;
      addStyledText(pdf, invoice.notes, margin + 5, currentY, { fontSize: 9 });
    }

    // Signature
    if (invoice.signatureData) {
      currentY += 20;
      try {
        const sigWidth = 50;
        const sigHeight = 20;
        pdf.addImage(invoice.signatureData, 'PNG', margin, currentY, sigWidth, sigHeight);

        currentY += sigHeight + 5;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, margin + 80, currentY);

        currentY += 5;
        addStyledText(pdf, "Authorized Signature", margin, currentY, { 
          fontSize: 8, 
          color: [100, 100, 100] 
        });
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