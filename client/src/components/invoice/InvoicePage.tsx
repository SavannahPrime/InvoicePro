import { useState } from "react";
import { DocumentTypeToggle } from "./DocumentTypeToggle";
import { DocumentForm } from "./DocumentForm";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceFooter } from "./InvoiceFooter";
import { Invoice } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { generateDefaultInvoice } from "@/lib/invoiceUtils";

export function InvoicePage() {
  const [invoice, setInvoice] = useState<Invoice>(generateDefaultInvoice());
  const { toast } = useToast();

  const handleSaveTemplate = () => {
    // In a real app, this would save the template to storage
    toast({
      title: "Template Saved",
      description: "Your template has been saved successfully.",
    });
  };

  const toggleDocumentType = (isQuotation: boolean) => {
    setInvoice((prev) => ({
      ...prev,
      isQuotation,
      invoiceNumber: isQuotation 
        ? `QUO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
        : `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <InvoiceHeader onSaveTemplate={handleSaveTemplate} />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DocumentTypeToggle 
            isQuotation={invoice.isQuotation}
            onToggle={toggleDocumentType}
          />
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
            <DocumentForm 
              invoice={invoice}
              setInvoice={setInvoice}
            />
          </div>
        </div>
      </main>
      
      <InvoiceFooter />
    </div>
  );
}
