import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Invoice } from "@/lib/types";

interface SignatureSectionProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

export function SignatureSection({ invoice, setInvoice }: SignatureSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(!!invoice.signatureData);
  const [agreesToTerms, setAgreesToTerms] = useState(true);

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
        ctx.drawImage(img, 0, 0);
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
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
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
  };

  const handleTermsChange = (checked: boolean) => {
    setAgreesToTerms(checked);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">SIGNATURE</h3>
        <canvas
          ref={canvasRef}
          width={400}
          height={96}
          className="border border-dashed border-gray-300 rounded-md p-4 h-24 w-full bg-gray-50"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="mt-2 flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-primary-600 hover:text-primary-800"
            onClick={clearSignature}
            disabled={!hasSigned}
          >
            Clear Signature
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreesToTerms}
              onCheckedChange={handleTermsChange}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-500"
            >
              I agree to the terms
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
