import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from "@/lib/types";
import { Building2, Mail, MapPin, CreditCard, CalendarClock, FileText } from "lucide-react";

interface ClientInfoSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function ClientInfoSection({ invoice, setInvoice }: ClientInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bill To */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Client Information</h3>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Label 
                htmlFor="client-name" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Client/Company Name
              </Label>
              <div className="relative">
                <Input
                  id="client-name"
                  value={invoice.clientName}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  className="pl-9 bg-white/50"
                  placeholder="Client or company name"
                />
                <Building2 className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="client-address" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Billing Address
              </Label>
              <div className="relative">
                <Textarea
                  id="client-address"
                  value={invoice.clientAddress || ""}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      clientAddress: e.target.value,
                    }))
                  }
                  className="pl-9 pt-2 resize-none bg-white/50"
                  placeholder="Street address, city, state, zip code"
                  rows={3}
                />
                <MapPin className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="client-email" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Email Address
              </Label>
              <div className="relative">
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
                  className="pl-9 bg-white/50"
                  placeholder="client@example.com"
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Payment Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label 
                htmlFor="payment-method" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Payment Method
              </Label>
              <div className="relative">
                <Select
                  value={invoice.paymentMethod || ""}
                  onValueChange={(value) =>
                    setInvoice((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                >
                  <SelectTrigger id="payment-method" className="pl-9 bg-white/50">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-PESA">M-PESA</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <CreditCard className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="payment-terms" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Payment Terms
              </Label>
              <div className="relative">
                <Select
                  value={invoice.paymentTerms || ""}
                  onValueChange={(value) =>
                    setInvoice((prev) => ({
                      ...prev,
                      paymentTerms: value,
                    }))
                  }
                >
                  <SelectTrigger id="payment-terms" className="pl-9 bg-white/50">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                    <SelectItem value="Net 15">Net 15 Days</SelectItem>
                    <SelectItem value="Net 30">Net 30 Days</SelectItem>
                    <SelectItem value="Net 45">Net 45 Days</SelectItem>
                    <SelectItem value="Net 60">Net 60 Days</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <CalendarClock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="payment-instructions" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Payment Instructions
              </Label>
              <div className="relative">
                <Textarea
                  id="payment-instructions"
                  value={invoice.paymentInstructions || ""}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      paymentInstructions: e.target.value,
                    }))
                  }
                  className="pl-9 pt-2 resize-none bg-white/50"
                  placeholder="Additional payment details or bank account information"
                  rows={3}
                />
                <FileText className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Include specific instructions for how payment should be made.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
