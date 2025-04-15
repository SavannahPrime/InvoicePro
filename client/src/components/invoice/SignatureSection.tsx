import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, Trash2, Check, Pencil, Info } from "lucide-react";
import { Invoice } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface SignatureSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function SignatureSection({ invoice, setInvoice }: SignatureSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signatureBoxRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(!!invoice.signatureData);
  const [agreesToTerms, setAgreesToTerms] = useState(true);
  const [signatureDate, setSignatureDate] = useState<string>(
    format(new Date(), "MMMM d, yyyy")
  );
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Adjust canvas size to match parent container width
    const resizeCanvas = () => {
      if (canvas && signatureBoxRef.current) {
        const rect = signatureBoxRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 120; // Fixed height for signature

        // Redraw signature if exists after resize
        if (invoice.signatureData) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = invoice.signatureData;
          }
        }
      }
    };

    // Initial resize
    resizeCanvas();

    // Add resize listener
    window.addEventListener("resize", resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [invoice.signatureData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If we have a signature, draw it
    if (invoice.signatureData) {
      const img = new Image();
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
      img.src = invoice.signatureData;
    }
  }, [invoice.signatureData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSigned(true);

    // Get position
    let posX, posY;
    if ("touches" in e) {
      e.preventDefault(); // Prevent scrolling while signing on touch devices
      const rect = canvas.getBoundingClientRect();
      posX = e.touches[0].clientX - rect.left;
      posY = e.touches[0].clientY - rect.top;
    } else {
      posX = e.nativeEvent.offsetX;
      posY = e.nativeEvent.offsetY;
    }

    // Start drawing
    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get position
    let posX, posY;
    if ("touches" in e) {
      e.preventDefault(); // Prevent scrolling while signing on touch devices
      const rect = canvas.getBoundingClientRect();
      posX = e.touches[0].clientX - rect.left;
      posY = e.touches[0].clientY - rect.top;
    } else {
      posX = e.nativeEvent.offsetX;
      posY = e.nativeEvent.offsetY;
    }

    // Draw line
    ctx.lineTo(posX, posY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL("image/png");
    setInvoice((prev) => ({
      ...prev,
      signatureData,
    }));

    if (hasSigned) {
      setSignatureDate(format(new Date(), "MMMM d, yyyy"));
      toast({
        title: "Signature updated",
        description: "Your signature has been saved",
      });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);

    setInvoice((prev) => ({
      ...prev,
      signatureData: "",
    }));

    toast({
      title: "Signature cleared",
      description: "Your signature has been removed",
    });
  };

  const handleTermsChange = (checked: boolean) => {
    setAgreesToTerms(checked);
  };

  return (
    <Card className="border border-gray-200 shadow-sm mb-6">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Pen className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Signature</h3>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-gray-500 hover:text-primary">
                  <Info className="h-3.5 w-3.5 mr-1" />
                  <span>Help</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Sign using your mouse or finger on touch devices.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div 
              ref={signatureBoxRef}
              className="border border-dashed border-gray-300 rounded-md h-[120px] w-full bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden"
            >
              {!hasSigned && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <Pencil className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">Sign here</p>
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="mt-3 flex flex-col md:flex-row justify-between md:items-center space-y-3 md:space-y-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs justify-center md:justify-start"
                onClick={clearSignature}
                disabled={!hasSigned}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Clear Signature
              </Button>

              <div className="text-xs text-right text-gray-500">
                {hasSigned && (
                  <div className="flex items-center">
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                    Signed: {signatureDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Info className="h-4 w-4 text-gray-400 mr-2" />
                Agreement Information
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                By signing this {invoice.isQuotation ? 'quotation' : 'invoice'}, you agree to the 
                following terms and conditions:
              </p>
              <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                {invoice.isQuotation ? (
                  <>
                    <li>This quotation is valid for 30 days from the issue date.</li>
                    <li>Prices are subject to change after the validity period.</li>
                    <li>Terms and conditions of service apply to all work.</li>
                  </>
                ) : (
                  <>
                    <li>Payment is due by the date specified in the payment terms.</li>
                    <li>Late payments may incur additional fees.</li>
                    <li>All services rendered are subject to the terms of service.</li>
                  </>
                )}
              </ul>
            </div>

            <div className="space-y-4 mt-4">
                <div>
                  <Label 
                    htmlFor="signee-name" 
                    className="block text-xs font-medium text-gray-500 mb-1.5"
                  >
                    Signee Name
                  </Label>
                  <Input
                    id="signee-name"
                    value={invoice.signeeName || ''}
                    onChange={(e) =>
                      setInvoice((prev) => ({
                        ...prev,
                        signeeName: e.target.value,
                      }))
                    }
                    className="bg-white/50"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreesToTerms}
                    onCheckedChange={handleTermsChange}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    I agree to the terms and conditions outlined above
                  </Label>
                </div>
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}