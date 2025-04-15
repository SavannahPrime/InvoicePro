
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceHeaderProps {
  onSaveTemplate: () => void;
}

export function InvoiceHeader({ onSaveTemplate }: InvoiceHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-primary">SavannahPrime Agency</h1>
            <p className="text-sm text-gray-600 mt-1">Professional Business Solutions</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={onSaveTemplate}
              className="inline-flex items-center bg-primary/90 hover:bg-primary text-white shadow-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="inline-flex items-center shadow-sm">
                  Export
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="cursor-pointer">PDF Export</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Excel Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
