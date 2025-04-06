import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Upload, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Invoice } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CompanyInfoSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function CompanyInfoSection({ invoice, setInvoice }: CompanyInfoSectionProps) {
  const [logoUploading, setLogoUploading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      alert("Only image files are allowed");
      return;
    }

    try {
      setLogoUploading(true);
      
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("logo", file);

      // In a real app, we would upload to the server
      // For now, we'll just use a FileReader to get a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setInvoice((prev) => ({
          ...prev,
          companyLogo: result,
        }));
        setLogoUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
      setLogoUploading(false);
    }
  };

  const handleDateChange = (field: 'date' | 'dueDate', date: Date | undefined) => {
    if (!date) return;
    
    setInvoice((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Company Logo */}
      <div className="col-span-1">
        <div className="flex flex-col items-start">
          <div className="bg-gray-100 border border-dashed border-gray-300 rounded-md p-4 mb-2 w-48 h-24 flex items-center justify-center">
            {invoice.companyLogo ? (
              <img 
                src={invoice.companyLogo} 
                alt="Company Logo" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <span className="text-sm text-gray-500">Company Logo</span>
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="file"
              id="logo-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleLogoChange}
              accept="image/*"
              disabled={logoUploading}
            />
            <Button
              type="button"
              variant="link"
              className="text-sm text-primary hover:text-primary"
              disabled={logoUploading}
            >
              {logoUploading ? "Uploading..." : "Upload Logo"}
            </Button>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="col-span-1">
        <h3 className="text-sm font-medium text-gray-500 mb-1">FROM</h3>
        <div className="space-y-1">
          <Input
            value={invoice.companyName}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                companyName: e.target.value,
              }))
            }
            className="font-semibold text-gray-800"
            placeholder="Your Company Name"
          />
          <textarea
            value={invoice.companyAddress || ""}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                companyAddress: e.target.value,
              }))
            }
            className="w-full text-sm text-gray-600 resize-none p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Company Address"
            rows={3}
          />
          <Input
            type="email"
            value={invoice.companyEmail || ""}
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                companyEmail: e.target.value,
              }))
            }
            className="text-sm text-gray-600"
            placeholder="company@example.com"
          />
        </div>
      </div>

      {/* Date and Invoice Number */}
      <div className="col-span-1">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-500 mb-1">DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !invoice.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoice.date ? format(invoice.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={invoice.date}
                  onSelect={(date) => handleDateChange('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500 mb-1">DUE DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !invoice.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoice.dueDate ? format(invoice.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={invoice.dueDate}
                  onSelect={(date) => handleDateChange('dueDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
