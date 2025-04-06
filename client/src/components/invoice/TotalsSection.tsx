import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatCurrency, calculateInvoiceTotals } from "@/lib/invoiceUtils";
import { Invoice } from "@/lib/types";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Notes */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">NOTES</h3>
        <Textarea
          rows={4}
          className="block w-full"
          placeholder="Additional notes or terms..."
          value={invoice.notes || ""}
          onChange={(e) => handleNotesChange(e.target.value)}
        />
      </div>

      {/* Calculations */}
      <div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between py-2">
            <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900 font-mono">
              {formatCurrency(parseFloat(invoice.subtotal))}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <span>Tax Rate</span>
              <div className="relative ml-2">
                <Input
                  type="text"
                  className="inline w-16 text-right"
                  value={invoice.taxRate || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    handleTaxRateChange(value);
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </dt>
            <dd className="text-sm font-medium text-gray-900 font-mono">
              {formatCurrency(parseFloat(invoice.taxAmount || "0"))}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <span>Discount</span>
              <div className="relative ml-2">
                <Input
                  type="text"
                  className="inline w-16 text-right"
                  value={invoice.discount || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    handleDiscountChange(value);
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </dt>
            <dd className="text-sm font-medium text-gray-900 font-mono">
              -{formatCurrency(parseFloat(invoice.discountAmount || "0"))}
            </dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-base font-bold text-gray-900">Total</dt>
            <dd className="text-base font-bold text-primary font-mono">
              {formatCurrency(parseFloat(invoice.total))}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
