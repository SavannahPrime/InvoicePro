import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { 
  FileDown, 
  Edit, 
  Send, 
  ArrowLeft,
  Printer
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { generatePdf } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Invoice } from "@/lib/types";
import { Link, useLocation } from "wouter";
import { formatCurrency } from "@/lib/invoiceUtils";
import { format } from "date-fns";

export default function DocumentPreview() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const storedInvoice = localStorage.getItem("previewInvoice");
    if (storedInvoice) {
      try {
        const parsedInvoice = JSON.parse(storedInvoice);
        // Convert date strings back to Date objects
        if (parsedInvoice.date) {
          parsedInvoice.date = new Date(parsedInvoice.date);
        }
        if (parsedInvoice.dueDate) {
          parsedInvoice.dueDate = new Date(parsedInvoice.dueDate);
        }
        setInvoice(parsedInvoice);
      } catch (error) {
        console.error("Error parsing invoice data:", error);
        toast({
          title: "Error",
          description: "Failed to load document preview.",
          variant: "destructive",
        });
      }
    } else {
      // If no preview data is available, go back to documents
      setLocation("/documents");
    }
  }, [toast, setLocation]);
  
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
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleBackToEdit = () => {
    setLocation("/document-new");
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
        title={`Preview ${invoice.isQuotation ? "Quotation" : "Invoice"}`}
        description="Preview how your document will look"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setLocation("/documents")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleBackToEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleDownloadPdf}>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        }
      />
      
      <div className="print:shadow-none mt-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto print:max-w-none">
        <div className="p-8 print:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div>
              {invoice.companyLogo ? (
                <img 
                  src={invoice.companyLogo} 
                  alt={invoice.companyName} 
                  className="h-16 object-contain mb-4"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{invoice.companyName}</h1>
              )}
              <div className="text-sm text-gray-600">
                {invoice.companyAddress && (
                  <p className="whitespace-pre-line">{invoice.companyAddress}</p>
                )}
                {invoice.companyEmail && <p>{invoice.companyEmail}</p>}
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 md:text-right">
              <h2 className="text-2xl font-bold text-primary uppercase">{invoice.isQuotation ? "Quotation" : "Invoice"}</h2>
              <p className="text-gray-600">#{invoice.invoiceNumber}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Date: </span>
                  {invoice.date ? format(invoice.date, "MMMM d, yyyy") : ""}
                </p>
                {!invoice.isQuotation && invoice.dueDate && (
                  <p>
                    <span className="font-medium">Due Date: </span>
                    {format(invoice.dueDate, "MMMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Client Info */}
          <div className="mb-10">
            <h3 className="text-gray-500 font-medium text-sm mb-2">BILL TO</h3>
            <div className="border-t border-gray-200 pt-2">
              <h4 className="text-gray-900 font-medium">{invoice.clientName}</h4>
              {invoice.clientAddress && (
                <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.clientAddress}</p>
              )}
              {invoice.clientEmail && (
                <p className="text-gray-600 text-sm">{invoice.clientEmail}</p>
              )}
            </div>
          </div>
          
          {/* Line Items */}
          <div className="mb-10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-left text-gray-500">
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium text-right">Qty</th>
                  <th className="pb-2 font-medium text-right">Unit Price</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 text-sm">
                    <td className="py-3 text-gray-900">{item.description}</td>
                    <td className="py-3 text-gray-900 text-right">{item.quantity}</td>
                    <td className="py-3 text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Totals */}
          <div className="mb-10 flex justify-end">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">{formatCurrency(parseFloat(invoice.subtotal))}</span>
              </div>
              
              {invoice.taxRate && parseFloat(invoice.taxRate) > 0 && (
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                  <span className="text-gray-900">{formatCurrency(parseFloat(invoice.taxAmount || "0"))}</span>
                </div>
              )}
              
              {invoice.discount && parseFloat(invoice.discount) > 0 && (
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <span className="text-gray-600">Discount ({invoice.discount}%)</span>
                  <span className="text-gray-900">-{formatCurrency(parseFloat(invoice.discountAmount || "0"))}</span>
                </div>
              )}
              
              <div className="flex justify-between py-3 border-t border-gray-200 text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">{formatCurrency(parseFloat(invoice.total))}</span>
              </div>
            </div>
          </div>
          
          {/* Notes and Payment Info */}
          <div className="mb-10">
            {invoice.notes && (
              <div className="mb-6">
                <h3 className="text-gray-500 font-medium text-sm mb-2">NOTES</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
            
            {!invoice.isQuotation && invoice.paymentMethod && (
              <div>
                <h3 className="text-gray-500 font-medium text-sm mb-2">PAYMENT INFORMATION</h3>
                <p className="text-gray-600 text-sm">{invoice.paymentMethod}</p>
                {invoice.paymentInstructions && (
                  <p className="text-gray-600 text-sm mt-1">{invoice.paymentInstructions}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Signature */}
          {invoice.signatureData && (
            <div className="mb-6">
              <h3 className="text-gray-500 font-medium text-sm mb-2">SIGNATURE</h3>
              <div className="border-t border-gray-200 pt-2">
                <img 
                  src={invoice.signatureData} 
                  alt="Signature" 
                  className="h-20 object-contain" 
                />
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="text-center text-gray-500 text-xs mt-10 pt-6 border-t border-gray-200">
            <p>
              {invoice.isQuotation 
                ? "Thank you for considering our services. This quotation is valid for 30 days from the date of issue."
                : "Thank you for your business! Payment is due by the date specified."}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mt-8 mb-6 print:hidden">
        <Button variant="outline" onClick={handleBackToEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Document
        </Button>
        <Button onClick={handleDownloadPdf}>
          <FileDown className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </DashboardLayout>
  );
}