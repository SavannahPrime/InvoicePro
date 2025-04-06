import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculateInvoiceTotals } from "@/lib/invoiceUtils";
import { Invoice } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Calculator, Percent, PlusCircle, MinusCircle, DollarSign } from "lucide-react";

interface TotalsSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function TotalsSection({ invoice, setInvoice }: TotalsSectionProps) {
  const handleTaxRateChange = (value: string) => {
    setInvoice((prev) => {
      const updatedInvoice = {
        ...prev,
        taxRate: value
      };
      return calculateInvoiceTotals(updatedInvoice);
    });
  };

  const handleDiscountChange = (value: string) => {
    setInvoice((prev) => {
      const updatedInvoice = {
        ...prev,
        discount: value
      };
      return calculateInvoiceTotals(updatedInvoice);
    });
  };

  const handleNotesChange = (value: string) => {
    setInvoice((prev) => ({
      ...prev,
      notes: value
    }));
  };
  
  // Quick preset tax rates
  const applyTaxRate = (rate: string) => {
    handleTaxRateChange(rate);
  };
  
  // Quick preset discounts
  const applyDiscount = (discount: string) => {
    handleDiscountChange(discount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Notes */}
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardContent className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Notes & Terms</h3>
          </div>
          
          <div className="relative">
            <Textarea
              rows={6}
              className="resize-none bg-white/50 p-4"
              placeholder="Add any additional notes, terms, or payment instructions here..."
              value={invoice.notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {invoice.notes?.length || 0}/500
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Notes will appear at the bottom of the {invoice.isQuotation ? 'quotation' : 'invoice'} document
            </p>
            
            <div className="mt-4 space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs w-full justify-start bg-white text-gray-600"
                onClick={() => handleNotesChange("Payment due within 30 days of invoice date. Please make payment to the bank account details provided.")}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-2 text-gray-500" />
                Add Payment Terms
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs w-full justify-start bg-white text-gray-600"
                onClick={() => handleNotesChange(invoice.notes ? `${invoice.notes}\n\nThank you for your business!` : "Thank you for your business!")}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-2 text-gray-500" />
                Add Thank You Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculations */}
      <Card className="border border-gray-200 shadow-sm h-full">
        <CardContent className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Calculator className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Totals</h3>
          </div>
          
          <div className="rounded-md border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900 font-mono">
                {formatCurrency(parseFloat(invoice.subtotal))}
              </dd>
            </div>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <span>Tax Rate</span>
                </dt>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      className="w-20 text-right font-medium bg-white/50"
                      value={invoice.taxRate || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        handleTaxRateChange(value);
                      }}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Percent className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div className="min-w-[90px] text-right font-mono text-sm font-medium text-gray-900">
                    {formatCurrency(parseFloat(invoice.taxAmount || "0"))}
                  </div>
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyTaxRate("")}
                >
                  None
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyTaxRate("5")}
                >
                  5%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyTaxRate("7.5")}
                >
                  7.5%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyTaxRate("10")}
                >
                  10%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyTaxRate("15")}
                >
                  15%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyTaxRate("20")}
                >
                  20%
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex justify-between items-center">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <span>Discount</span>
                </dt>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      className="w-20 text-right font-medium bg-white/50"
                      value={invoice.discount || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        handleDiscountChange(value);
                      }}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Percent className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div className="min-w-[90px] text-right font-mono text-sm font-medium text-gray-900">
                    <span className="text-gray-500">-</span> {formatCurrency(parseFloat(invoice.discountAmount || "0"))}
                  </div>
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyDiscount("")}
                >
                  None
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyDiscount("5")}
                >
                  5%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyDiscount("10")}
                >
                  10%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyDiscount("15")}
                >
                  15%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyDiscount("20")}
                >
                  20%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs bg-white"
                  onClick={() => applyDiscount("25")}
                >
                  25%
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="p-4 bg-primary/5 flex justify-between items-center">
              <dt className="text-base font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Total Amount
              </dt>
              <dd className="text-xl font-bold text-primary font-mono">
                {formatCurrency(parseFloat(invoice.total))}
              </dd>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-gray-500 italic">
              {invoice.isQuotation ? 
              "This quotation is valid for 30 days from the date of issue." : 
              "Payment is due by the date specified in the payment terms."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
