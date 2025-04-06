import { FileText, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentTypeToggleProps {
  isQuotation: boolean;
  onToggle: (isQuotation: boolean) => void;
}

export function DocumentTypeToggle({ isQuotation, onToggle }: DocumentTypeToggleProps) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col xs:flex-row items-center space-y-4 xs:space-y-0 xs:space-x-4">
          <p className="text-sm font-medium text-gray-700 xs:w-32">Document Type:</p>
          <div className="flex items-center justify-center flex-1">
            <div className="relative inline-flex rounded-md shadow-sm w-full max-w-md">
              <button
                type="button"
                onClick={() => onToggle(false)}
                className={cn(
                  "flex-1 relative inline-flex items-center justify-center px-6 py-2.5 border text-sm font-medium rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                  !isQuotation
                    ? "text-white bg-primary hover:bg-primary/90 border-transparent"
                    : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
                )}
              >
                <FileText className="h-4 w-4 mr-2" />
                Invoice
              </button>
              <button
                type="button"
                onClick={() => onToggle(true)}
                className={cn(
                  "flex-1 relative inline-flex items-center justify-center px-6 py-2.5 border text-sm font-medium rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                  isQuotation
                    ? "text-white bg-primary hover:bg-primary/90 border-transparent"
                    : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
                )}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Quotation
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
