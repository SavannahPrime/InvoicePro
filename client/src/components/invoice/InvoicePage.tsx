import { useState } from "react";
import { DocumentTypeToggle } from "./DocumentTypeToggle";
import { DocumentForm } from "./DocumentForm";
import { InvoiceFooter } from "./InvoiceFooter";
import { Invoice } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { generateDefaultInvoice } from "@/lib/invoiceUtils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DocumentPageHeader } from "@/components/layout/PageHeader";

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
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <DocumentPageHeader onSaveTemplate={handleSaveTemplate} />
        
        <div className="space-y-4">
          <DocumentTypeToggle 
            isQuotation={invoice.isQuotation}
            onToggle={toggleDocumentType}
          />
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <DocumentForm 
              invoice={invoice}
              setInvoice={setInvoice}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <InvoiceFooter />
      </div>
    </DashboardLayout>
  );
}
