import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusCircle, FileText } from "lucide-react";

export default function Documents() {
  const documents = [
    { id: 1, name: "Invoice #2024-001", client: "Acme Corp", date: "April 1, 2024", amount: "$1,200.00", type: "Invoice" },
    { id: 2, name: "Quotation #2024-001", client: "Beta Industries", date: "March 28, 2024", amount: "$3,500.00", type: "Quotation" },
    { id: 3, name: "Invoice #2024-002", client: "Gamma LLC", date: "March 15, 2024", amount: "$750.00", type: "Invoice" },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Documents" 
        description="Manage your invoices and quotations"
        actions={
          <Link href="/document/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </Link>
        }
      />
      
      <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doc.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doc.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        // Simulate fetching document and preparing for preview
                        const mockInvoice = {
                          invoiceNumber: `INV-${doc.id}`,
                          isQuotation: doc.type === "Quotation",
                          date: new Date(),
                          clientName: doc.client,
                          companyName: "SavannahPrime Agency",
                          items: [
                            {
                              id: "1",
                              description: "Professional Services",
                              quantity: 1,
                              unitPrice: parseFloat(doc.amount.replace(/[^0-9.-]+/g,"")),
                              amount: parseFloat(doc.amount.replace(/[^0-9.-]+/g,""))
                            }
                          ],
                          subtotal: doc.amount.replace(/[^0-9.-]+/g,""),
                          total: doc.amount.replace(/[^0-9.-]+/g,"")
                        };
                        localStorage.setItem("previewInvoice", JSON.stringify(mockInvoice));
                        window.location.href = "/document-preview";
                      }}
                      className="text-primary hover:text-primary-dark"
                    >
                      View
                    </Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <Link href={`/document/edit/${doc.id}`} className="text-primary hover:text-primary-dark">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}