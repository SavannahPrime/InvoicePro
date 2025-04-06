import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, Plus, FileText, Grip, DollarSign, ListChecks, Undo2 } from "lucide-react";
import { Invoice, InvoiceItem } from "@/lib/types";
import { formatCurrency, calculateItemAmount, calculateInvoiceTotals } from "@/lib/invoiceUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface LineItemsProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function LineItems({ invoice, setInvoice }: LineItemsProps) {
  const { toast } = useToast();
  
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
      return calculateInvoiceTotals({
        ...prev,
        items: updatedItems,
      });
    });
    
    // Scroll to the bottom of the table after adding a new item
    setTimeout(() => {
      const tableContainer = document.querySelector('.line-items-table-container');
      if (tableContainer) {
        tableContainer.scrollTop = tableContainer.scrollHeight;
      }
    }, 100);
  };

  const handleRemoveItem = (itemId: string) => {
    setInvoice((prev) => {
      // Don't remove if it's the last item
      if (prev.items.length <= 1) {
        toast({
          title: "Cannot remove item",
          description: "At least one item is required",
          variant: "destructive",
        });
        return prev;
      }

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
  
  // Add a common item that people might use
  const addCommonItem = (description: string, unitPrice: number) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description,
      quantity: 1,
      unitPrice,
      amount: unitPrice,
    };

    setInvoice((prev) => {
      const updatedItems = [...prev.items, newItem];
      return calculateInvoiceTotals({
        ...prev,
        items: updatedItems,
      });
    });
    
    toast({
      title: "Item added",
      description: `Added "${description}" to your ${invoice.isQuotation ? 'quotation' : 'invoice'}`,
    });
  };

  // Clear all items and add a blank one
  const clearAllItems = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };

    setInvoice((prev) => {
      return calculateInvoiceTotals({
        ...prev,
        items: [newItem],
      });
    });
    
    toast({
      title: "Items cleared",
      description: "All items have been removed",
    });
  };

  return (
    <Card className="border border-gray-200 shadow-sm mb-8">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <ListChecks className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Line Items</h3>
          </div>
          
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-white text-xs"
                    onClick={() => clearAllItems()}
                  >
                    <Undo2 className="h-3.5 w-3.5 mr-1.5" />
                    Clear All
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove all items and start fresh</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="overflow-x-auto line-items-table-container rounded-md border border-gray-200" style={{ maxHeight: invoice.items.length > 3 ? '400px' : 'auto' }}>
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-6/12 font-semibold">Description</TableHead>
                <TableHead className="w-1/12 text-center font-semibold">Qty</TableHead>
                <TableHead className="w-2/12 text-right font-semibold">Unit Price</TableHead>
                <TableHead className="w-2/12 text-right font-semibold">Amount</TableHead>
                <TableHead className="w-1/12 text-right font-semibold">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {invoice.items.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <TableCell className="align-top py-3">
                      <div className="flex items-start">
                        <div className="hidden md:flex h-9 items-center text-gray-400 mr-2">
                          <Grip className="h-4 w-4" />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          className="min-h-9 resize-none bg-white/50"
                          placeholder="Item description"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        className="text-center bg-white/50"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          className="pl-8 text-right bg-white/50"
                          placeholder="0.00"
                          value={item.unitPrice === 0 ? "" : item.unitPrice.toString()}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, "");
                            handleItemChange(index, "unitPrice", value);
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-right py-3">
                      <div className="inline-flex min-h-9 items-center font-medium">
                        {formatCurrency(item.amount)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 opacity-60 hover:opacity-100 hover:text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="inline-flex items-center text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
            onClick={handleAddItem}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Item
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-gray-200 bg-white text-xs"
                  onClick={() => addCommonItem("Consulting Services", 150)}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                  Add Consulting
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a consulting services item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-gray-200 bg-white text-xs"
                  onClick={() => addCommonItem("Website Development", 2500)}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                  Add Development
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a website development item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 bg-white text-xs"
                  onClick={() => addCommonItem("Monthly Maintenance", 99.99)}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                  Add Maintenance
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a maintenance service item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {invoice.items.length > 5 && (
          <p className="text-xs text-gray-500 mt-2">
            <Badge variant="outline" className="mr-1.5 font-normal">Tip</Badge>
            You can add as many items as needed. The table will scroll if there are many items.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
