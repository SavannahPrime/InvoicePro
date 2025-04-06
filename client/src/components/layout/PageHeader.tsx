import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Download, Share2, Save } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
          {actions}
        </div>
      </div>
      <Separator />
    </div>
  );
}

interface DocumentPageHeaderProps {
  onSaveTemplate?: () => void;
}

export function DocumentPageHeader({ onSaveTemplate }: DocumentPageHeaderProps = {}) {
  return (
    <PageHeader
      title="Document Creator"
      description="Create and manage professional invoices and quotations"
      actions={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>PDF</DropdownMenuItem>
              <DropdownMenuItem>HTML</DropdownMenuItem>
              <DropdownMenuItem>DOCX</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button 
            size="sm"
            onClick={onSaveTemplate}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </>
      }
    />
  );
}