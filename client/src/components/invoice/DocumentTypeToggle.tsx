import { FileText, FileCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentTypeToggleProps {
  isQuotation: boolean;
  onToggle: (isQuotation: boolean) => void;
}

export function DocumentTypeToggle({ isQuotation, onToggle }: DocumentTypeToggleProps) {
  return (
    <Card className="border border-gray-200 shadow-sm bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col xs:flex-row items-center space-y-4 xs:space-y-0 xs:space-x-4">
          <div className="flex xs:flex-col gap-2 items-center xs:items-start">
            <p className="text-sm font-medium text-gray-700">Document Type</p>
            <p className="text-xs text-gray-500 hidden xs:block">Choose the type of document</p>
          </div>
          
          <div className="flex items-center justify-center flex-1">
            <div className="relative inline-flex rounded-lg shadow-sm w-full max-w-md overflow-hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onToggle(false)}
                      className={cn(
                        "flex-1 relative inline-flex items-center justify-center gap-2 px-6 py-3 border text-sm font-medium rounded-l-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200",
                        !isQuotation
                          ? "text-white bg-primary hover:bg-primary/90 border-transparent"
                          : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
                      )}
                    >
                      <div className="flex flex-col xs:flex-row items-center xs:gap-2">
                        <FileText className={cn(
                          "h-5 w-5",
                          !isQuotation ? "" : "text-gray-500"
                        )} />
                        <span>Invoice</span>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Create a legal payment request document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onToggle(true)}
                      className={cn(
                        "flex-1 relative inline-flex items-center justify-center gap-2 px-6 py-3 border text-sm font-medium rounded-r-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200",
                        isQuotation
                          ? "text-white bg-primary hover:bg-primary/90 border-transparent"
                          : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
                      )}
                    >
                      <div className="flex flex-col xs:flex-row items-center xs:gap-2">
                        <FileCheck className={cn(
                          "h-5 w-5",
                          isQuotation ? "" : "text-gray-500"
                        )} />
                        <span>Quotation</span>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Create a price estimate for potential clients</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Animated indicator */}
              <motion.div 
                className="absolute bottom-0 h-1 bg-primary" 
                initial={false}
                animate={{
                  x: isQuotation ? "100%" : "0%",
                  width: "50%"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center gap-1">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">Toggle</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
