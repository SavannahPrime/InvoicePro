
import { useState } from "react";
import { CompanyInfoSection } from "./CompanyInfoSection";
import { ClientInfoSection } from "./ClientInfoSection";
import { LineItems } from "./LineItems";
import { TotalsSection } from "./TotalsSection";
import { SignatureSection } from "./SignatureSection";
import { format } from "date-fns";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePdf } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Invoice } from "@/lib/types";

interface DocumentFormProps {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
}

export function DocumentForm({ invoice, setInvoice }: DocumentFormProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    setIsGeneratingPdf(true);
    
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
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-10">
        <CompanyInfoSection invoice={invoice} setInvoice={setInvoice} />
        <div className="mt-6 md:mt-0 md:text-right">
          <h2 className="text-2xl font-bold text-primary uppercase">
            {invoice.isQuotation ? "Quotation" : "Invoice"}
          </h2>
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
          <ClientInfoSection invoice={invoice} setInvoice={setInvoice} />
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-10">
        <LineItems invoice={invoice} setInvoice={setInvoice} />
      </div>

      {/* Totals */}
      <div className="mb-10">
        <TotalsSection invoice={invoice} setInvoice={setInvoice} />
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
      <SignatureSection invoice={invoice} setInvoice={setInvoice} />

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs mt-10 pt-6 border-t border-gray-200">
        <p>
          {invoice.isQuotation 
            ? "Thank you for considering our services. This quotation is valid for 30 days from the date of issue."
            : "Thank you for your business! Payment is due by the date specified."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8 print:hidden">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="items-center border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          <Printer className="h-4 w-4 mr-1.5" />
          Print Now
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="items-center text-primary-600 bg-primary-50 bg-opacity-20 hover:bg-opacity-30 border-transparent"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
