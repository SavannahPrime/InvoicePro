import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Calendar as CalendarIcon, 
  X, 
  Building2, 
  Mail, 
  MapPin, 
  Hash, 
  Clock
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Invoice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface CompanyInfoSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function CompanyInfoSection({ invoice, setInvoice }: CompanyInfoSectionProps) {
  const [logoUploading, setLogoUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      toast({
        title: "Error",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }

    try {
      setLogoUploading(true);
      
      // Create FileReader to convert image to data URL
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setInvoice((prev) => ({
          ...prev,
          companyLogo: result,
        }));
        setLogoUploading(false);
        toast({
          title: "Success",
          description: "Company logo uploaded successfully",
        });
      };
      
      reader.onerror = () => {
        setLogoUploading(false);
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
      setLogoUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveLogo = () => {
    setInvoice((prev) => ({
      ...prev,
      companyLogo: "",
    }));
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Logo Removed",
      description: "Company logo has been removed",
    });
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
      <Card className="col-span-1 border border-gray-200 shadow-sm flex flex-col">
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Company Logo</h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 w-full h-40 flex items-center justify-center relative overflow-hidden">
              {invoice.companyLogo ? (
                <div className="relative w-full h-full flex items-center justify-center group">
                  <img 
                    src={invoice.companyLogo} 
                    alt="Company Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                      type="button" 
                      size="sm"
                      variant="outline" 
                      className="bg-white hover:bg-gray-100"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Drag and drop logo file</p>
                  <p className="text-xs text-gray-500">or click to browse</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 w-full relative">
              <input
                type="file"
                id="logo-upload"
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleLogoChange}
                accept="image/*"
                disabled={logoUploading}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm bg-white"
                disabled={logoUploading}
              >
                {logoUploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {invoice.companyLogo ? "Change Logo" : "Upload Logo"}
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Max file size: 2MB. Supported formats: JPG, PNG, SVG
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card className="col-span-1 border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Company Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label 
                htmlFor="company-name" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Company Name
              </Label>
              <div className="relative">
                <Input
                  id="company-name"
                  value={invoice.companyName}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  className="pl-9 bg-white/50 font-medium"
                  placeholder="Your Company Name"
                />
                <Building2 className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="company-address" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Company Address
              </Label>
              <div className="relative">
                <Textarea
                  id="company-address"
                  value={invoice.companyAddress || ""}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      companyAddress: e.target.value,
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
                htmlFor="company-email" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Company Email
              </Label>
              <div className="relative">
                <Input
                  id="company-email"
                  type="email"
                  value={invoice.companyEmail || ""}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      companyEmail: e.target.value,
                    }))
                  }
                  className="pl-9 bg-white/50"
                  placeholder="company@example.com"
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date and Invoice Number */}
      <Card className="col-span-1 border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Document Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label 
                htmlFor="invoice-number" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Invoice Number
              </Label>
              <div className="relative">
                <Input
                  id="invoice-number"
                  value={invoice.invoiceNumber}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      invoiceNumber: e.target.value,
                    }))
                  }
                  className="pl-9 bg-white/50 font-medium"
                  placeholder="INV-001"
                />
                <Hash className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="date" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Date Created
              </Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal pl-9 bg-white/50",
                        !invoice.date && "text-muted-foreground"
                      )}
                    >
                      {invoice.date ? format(invoice.date, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={invoice.date}
                      onSelect={(date) => handleDateChange('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <CalendarIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              </div>
            </div>
            
            <div>
              <Label 
                htmlFor="due-date" 
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Valid Until
              </Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="due-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal pl-9 bg-white/50",
                        !invoice.dueDate && "text-muted-foreground"
                      )}
                    >
                      {invoice.dueDate ? format(invoice.dueDate, "PPP") : <span>Select due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={invoice.dueDate}
                      onSelect={(date) => handleDateChange('dueDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Clock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {invoice.paymentTerms ? `Terms: ${invoice.paymentTerms}` : "Set payment terms below"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
