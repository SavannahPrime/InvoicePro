import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DocumentForm } from "@/components/invoice/DocumentForm";
import { DocumentTypeToggle } from "@/components/invoice/DocumentTypeToggle";
import { ClientInfoSection } from "@/components/invoice/ClientInfoSection";
import { CompanyInfoSection } from "@/components/invoice/CompanyInfoSection";
import { LineItems } from "@/components/invoice/LineItems";
import { TotalsSection } from "@/components/invoice/TotalsSection";
import { SignatureSection } from "@/components/invoice/SignatureSection";
import { CardContent, Card } from "@/components/ui/card";
import { 
  Save, 
  FileDown, 
  Eye, 
  FileText, 
  RotateCcw, 
  ArrowLeft 
} from "lucide-react";
import { generateDefaultInvoice } from "@/lib/invoiceUtils";
import { generatePdf } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Invoice } from "@/lib/types";
import { useLocation } from "wouter";

// Create a wrapper component for the invoice form
const InvoiceFormWrapper = ({ 
  invoice, 
  setInvoice 
}: { 
  invoice: Invoice, 
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>> 
}) => {
  return (
    <>
      <Card className="mt-6 mb-4">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Document Type</h2>
            <DocumentTypeToggle 
              isQuotation={invoice.isQuotation} 
              onToggle={(isQuotation) => 
                setInvoice(prev => ({ ...prev, isQuotation }))
              } 
            />
          </div>
          
          <DocumentForm invoice={invoice} setInvoice={setInvoice} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CompanyInfoSection invoice={invoice} setInvoice={setInvoice} />
        <ClientInfoSection invoice={invoice} setInvoice={setInvoice} />
      </div>
      
      <LineItems invoice={invoice} setInvoice={setInvoice} />
      
      <TotalsSection invoice={invoice} setInvoice={setInvoice} />
      
      <SignatureSection invoice={invoice} setInvoice={setInvoice} />
    </>
  );
};

export default function DocumentNew() {
  const [invoice, setInvoice] = useState<Invoice>(() => generateDefaultInvoice());
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const handleDownloadPdf = async () => {
    try {
      await generatePdf(invoice);
      toast({
        title: "PDF Generated",
        description: "Your document has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSave = () => {
    // Here we would typically save to the backend
    toast({
      title: "Document Saved",
      description: "Your document has been saved successfully.",
    });
    // Redirect to documents list
    setLocation("/documents");
  };
  
  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your template has been saved for future use.",
    });
  };
  
  const handlePreview = () => {
    // Store invoice data in localStorage to pass to preview page
    localStorage.setItem("previewInvoice", JSON.stringify(invoice));
    // Navigate to preview page
    setLocation("/document-preview");
  };
  
  const handleReset = () => {
    setInvoice(generateDefaultInvoice());
    toast({
      title: "Document Reset",
      description: "All fields have been reset to default values.",
    });
  };
  
  return (
    <DashboardLayout>
      <PageHeader
        title={`New ${invoice.isQuotation ? "Quotation" : "Invoice"}`}
        description="Create a new document"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setLocation("/documents")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Document
            </Button>
          </div>
        }
      />
      
      <InvoiceFormWrapper invoice={invoice} setInvoice={setInvoice} />
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Form
        </Button>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleSaveTemplate}>
            <FileText className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="secondary" onClick={handleDownloadPdf}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Document
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}