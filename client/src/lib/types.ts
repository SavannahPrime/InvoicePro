export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  invoiceNumber: string;
  isQuotation: boolean;
  date: Date;
  dueDate?: Date;
  clientName: string;
  clientAddress?: string;
  clientEmail?: string;
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyLogo?: string;
  paymentMethod?: string;
  paymentTerms?: string;
  paymentInstructions?: string;
  items: InvoiceItem[];
  notes?: string;
  taxRate?: string;
  discount?: string;
  subtotal: string;
  taxAmount?: string;
  discountAmount?: string;
  total: string;
  signatureData?: string;
  signeeName?: string;
}
