import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice } from "@/lib/types";

interface ClientInfoSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function ClientInfoSection({ invoice, setInvoice }: ClientInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Bill To */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">BILL TO</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="client-name" className="block text-xs font-medium text-gray-500">
              Client/Company
            </Label>
            <Input
              id="client-name"
              value={invoice.clientName}
              onChange={(e) =>
                setInvoice((prev) => ({
                  ...prev,
                  clientName: e.target.value,
                }))
              }
              className="mt-1"
              placeholder="Client or company name"
            />
          </div>
          <div>
            <Label htmlFor="client-address" className="block text-xs font-medium text-gray-500">
              Address
            </Label>
            <Textarea
              id="client-address"
              value={invoice.clientAddress || ""}
              onChange={(e) =>
                setInvoice((prev) => ({
                  ...prev,
                  clientAddress: e.target.value,
                }))
              }
              className="mt-1"
              placeholder="Street address, city, state, zip code"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="client-email" className="block text-xs font-medium text-gray-500">
              Email
            </Label>
            <Input
              type="email"
              id="client-email"
              value={invoice.clientEmail || ""}
              onChange={(e) =>
                setInvoice((prev) => ({
                  ...prev,
                  clientEmail: e.target.value,
                }))
              }
              className="mt-1"
              placeholder="client@example.com"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">PAYMENT DETAILS</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="payment-method" className="block text-xs font-medium text-gray-500">
              Payment Method
            </Label>
            <Select
              value={invoice.paymentMethod || ""}
              onValueChange={(value) =>
                setInvoice((prev) => ({
                  ...prev,
                  paymentMethod: value,
                }))
              }
            >
              <SelectTrigger id="payment-method" className="mt-1">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payment-terms" className="block text-xs font-medium text-gray-500">
              Payment Terms
            </Label>
            <Select
              value={invoice.paymentTerms || ""}
              onValueChange={(value) =>
                setInvoice((prev) => ({
                  ...prev,
                  paymentTerms: value,
                }))
              }
            >
              <SelectTrigger id="payment-terms" className="mt-1">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payment-instructions" className="block text-xs font-medium text-gray-500">
              Additional Instructions
            </Label>
            <Textarea
              id="payment-instructions"
              value={invoice.paymentInstructions || ""}
              onChange={(e) =>
                setInvoice((prev) => ({
                  ...prev,
                  paymentInstructions: e.target.value,
                }))
              }
              className="mt-1"
              placeholder="e.g., Bank account details"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
