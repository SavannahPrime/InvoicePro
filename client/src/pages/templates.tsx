import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusCircle, FileText, Copy, Pencil, Trash2 } from "lucide-react";

export default function Templates() {
  const templates = [
    { 
      id: 1, 
      name: "Standard Invoice", 
      description: "Default invoice template with company branding",
      type: "Invoice",
      lastUsed: "March 15, 2024" 
    },
    { 
      id: 2, 
      name: "Detailed Quotation", 
      description: "Comprehensive quotation with itemized breakdown",
      type: "Quotation",
      lastUsed: "March 28, 2024" 
    },
    { 
      id: 3, 
      name: "Minimal Invoice", 
      description: "Clean, simplified invoice design",
      type: "Invoice",
      lastUsed: "April 1, 2024" 
    },
    { 
      id: 4, 
      name: "Professional Services", 
      description: "Template for consulting and professional services",
      type: "Invoice",
      lastUsed: "March 20, 2024" 
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Templates" 
        description="Manage document templates"
        actions={
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Template
          </Button>
        }
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div key={template.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">{template.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    {template.type}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                {template.description}
              </p>
              
              <div className="text-xs text-gray-500 mb-4">
                Last used: {template.lastUsed}
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Use
                </Button>
                <Button size="sm" variant="outline">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Create new template card */}
        <div className="bg-white shadow rounded-lg overflow-hidden border border-dashed border-gray-300">
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">Create New Template</h3>
            <p className="text-sm text-gray-500 mb-4">
              Design a custom template for your documents
            </p>
            <Button>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}