import { Invoice, InvoiceItem } from "./types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function calculateItemAmount(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function calculateInvoiceTotals(invoice: Invoice): Invoice {
  // Calculate the subtotal (sum of all item amounts)
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate tax amount if tax rate is provided
  const taxRate = parseFloat(invoice.taxRate || "0");
  const taxAmount = (subtotal * taxRate / 100).toFixed(2);
  
  // Calculate discount amount if discount is provided
  const discount = parseFloat(invoice.discount || "0");
  const discountAmount = (subtotal * discount / 100).toFixed(2);
  
  // Calculate total
  const total = (subtotal + parseFloat(taxAmount) - parseFloat(discountAmount)).toFixed(2);
  
  return {
    ...invoice,
    subtotal: subtotal.toFixed(2),
    taxAmount,
    discountAmount,
    total
  };
}

export function generateDefaultInvoice(): Invoice {
  const date = new Date();
  
  // Add 30 days for the due date
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + 30);
  
  // Generate a random invoice number
  const invoiceNumber = `INV-${date.getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
  
  // Default item
  const defaultItem: InvoiceItem = {
    id: "item-1",
    description: "Website Redesign - Premium Package",
    quantity: 1,
    unitPrice: 0,
    amount: 0
  };
  
  const invoice: Invoice = {
    invoiceNumber,
    isQuotation: false,
    date,
    dueDate,
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    companyName: "SavannahPrime Agency",
    companyAddress: "",
    companyEmail: "",
    companyLogo: "",
    paymentMethod: "Bank Transfer",
    paymentTerms: "Net 30",
    paymentInstructions: "",
    items: [defaultItem],
    notes: "Thank you for your business! We look forward to working with you on future projects.",
    taxRate: "0",
    discount: "0",
    subtotal: "0",
    taxAmount: "0",
    discountAmount: "0",
    total: "0",
    signatureData: ""
  };
  
  return calculateInvoiceTotals(invoice);
}
