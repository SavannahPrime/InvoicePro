import { useEffect, useState } from "react";
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
  SendHorizontal,
  Trash2,
  ArrowLeft
} from "lucide-react";
import { generateDefaultInvoice } from "@/lib/invoiceUtils";
import { generatePdf } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Invoice } from "@/lib/types";
import { useParams, useLocation } from "wouter";

// Create a wrapper component for conditional rendering
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

export default function DocumentEdit() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams();
  const documentId = params.id;
  
  useEffect(() => {
    // In a real app, we would fetch the document by ID from the backend
    // For now, we'll simulate by creating a default invoice with the ID
    const fetchInvoice = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockInvoice = generateDefaultInvoice();
        mockInvoice.invoiceNumber = `INV-${documentId}`;
        setInvoice(mockInvoice);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast({
          title: "Error",
          description: "Failed to load document. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchInvoice();
  }, [documentId, toast]);
  
  const handleDownloadPdf = async () => {
    if (!invoice) return;
    
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
    // Here we would typically update in the backend
    toast({
      title: "Document Updated",
      description: "Your document has been updated successfully.",
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
    if (!invoice) return;
    
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
  
  const handleDelete = () => {
    // Here we would typically delete from the backend
    toast({
      title: "Document Deleted",
      description: "Your document has been deleted.",
    });
    // Redirect to documents list
    setLocation("/documents");
  };
  
  if (!invoice) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <PageHeader
        title={`Edit ${invoice.isQuotation ? "Quotation" : "Invoice"} #${invoice.invoiceNumber}`}
        description="Update document information"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setLocation("/documents")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        }
      />
      
      {/* We use the wrapper component to handle the form correctly */}
      <InvoiceFormWrapper 
        invoice={invoice} 
        setInvoice={(updatedInvoice) => {
          // Handle the state correctly with proper type checking
          if (typeof updatedInvoice === 'function') {
            setInvoice(prev => prev ? updatedInvoice(prev) : null);
          } else {
            setInvoice(updatedInvoice);
          }
        }} 
      />
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Document
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
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}