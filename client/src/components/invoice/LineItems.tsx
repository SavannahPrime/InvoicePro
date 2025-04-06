import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { Invoice, InvoiceItem } from "@/lib/types";
import { formatCurrency, calculateItemAmount, calculateInvoiceTotals } from "@/lib/invoiceUtils";

interface LineItemsProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function LineItems({ invoice, setInvoice }: LineItemsProps) {
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };

    setInvoice((prev) => {
      const updatedItems = [...prev.items, newItem];
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setInvoice((prev) => {
      // Don't remove if it's the last item
      if (prev.items.length <= 1) return prev;

      const updatedItems = prev.items.filter((item) => item.id !== itemId);
      const updatedInvoice = {
        ...prev,
        items: updatedItems,
      };
      
      return calculateInvoiceTotals(updatedInvoice);
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoice((prev) => {
      const updatedItems = [...prev.items];
      
      if (field === 'quantity' || field === 'unitPrice') {
        // Convert string to number for quantity and unitPrice
        const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: numValue,
          // Recalculate amount when quantity or unitPrice changes
          amount: calculateItemAmount(
            field === 'quantity' ? numValue : updatedItems[index].quantity, 
            field === 'unitPrice' ? numValue : updatedItems[index].unitPrice
          )
        };
      } else {
        // For description field
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value,
        };
      }
      
      const updatedInvoice = {
        ...prev,
        items: updatedItems,
      };
      
      return calculateInvoiceTotals(updatedInvoice);
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3">ITEMS</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-6/12">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-1/12">
                Qty
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-2/12">
                Unit Price
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-2/12">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-1/12">
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoice.items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-3 whitespace-normal">
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="block w-full"
                    placeholder="Item description"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="block w-full text-right"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="text"
                      className="block w-full pl-7 text-right"
                      placeholder="0.00"
                      value={item.unitPrice === 0 ? "" : item.unitPrice.toString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        handleItemChange(index, "unitPrice", value);
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {formatCurrency(item.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Button
          type="button"
          variant="outline"
          className="inline-flex items-center text-gray-700 bg-white hover:bg-gray-50"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
