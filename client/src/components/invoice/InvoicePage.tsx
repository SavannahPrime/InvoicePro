
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          <DocumentPageHeader onSaveTemplate={handleSaveTemplate} />
          
          <div className="space-y-6">
            <DocumentTypeToggle 
              isQuotation={invoice.isQuotation}
              onToggle={toggleDocumentType}
            />
            
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
              <DocumentForm 
                invoice={invoice}
                setInvoice={setInvoice}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 mb-8">
          <InvoiceFooter />
        </div>
      </div>
    </DashboardLayout>
  );
}
