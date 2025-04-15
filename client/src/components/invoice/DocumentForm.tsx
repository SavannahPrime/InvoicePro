import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CompanyInfoSection } from "./CompanyInfoSection";
import { ClientInfoSection } from "./ClientInfoSection";
import { LineItems } from "./LineItems";
import { TotalsSection } from "./TotalsSection";
import { SignatureSection } from "./SignatureSection";
import { Button } from "@/components/ui/button";
import { generatePdf } from "@/lib/pdfGenerator";
import { Download, Printer } from "lucide-react";
import { Invoice } from "@/lib/types";

interface DocumentFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function DocumentForm({ invoice, setInvoice }: DocumentFormProps) {
  const { toast } = useToast();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    // Validate required fields before generating PDF
    if (!invoice.clientName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a client name before generating PDF.",
        variant: "destructive",
      });
      return;
    }

    if (invoice.items.length === 0 || invoice.items.some(item => !item.description.trim())) {
      toast({
        title: "Missing Information",
        description: "Please add at least one item with a description.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingPdf(true);
      await generatePdf(invoice);
      toast({
        title: "PDF Generated",
        description: `Your ${invoice.isQuotation ? 'quotation' : 'invoice'} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
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
    <div className="p-6 border-b border-gray-200" id="document-form">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {invoice.isQuotation
              ? `Quotation #${invoice.invoiceNumber}`
              : `Invoice #${invoice.invoiceNumber}`}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Created: {invoice.date ? format(invoice.date, 'PPP') : 'Not set'} • 
            Valid until: {invoice.dueDate ? format(invoice.dueDate, 'PPP') : 'Not set'}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="items-center text-primary-600 bg-primary-50 bg-opacity-20 hover:bg-opacity-30 border-transparent"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="items-center border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print Now
          </Button>
        </div>
      </div>

      <CompanyInfoSection invoice={invoice} setInvoice={setInvoice} />
      <ClientInfoSection invoice={invoice} setInvoice={setInvoice} />
      <LineItems invoice={invoice} setInvoice={setInvoice} />
      <TotalsSection invoice={invoice} setInvoice={setInvoice} />
      <SignatureSection invoice={invoice} setInvoice={setInvoice} />
    </div>
  );
}
