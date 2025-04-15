import { FileText, MessageCircle, Phone, Mail } from "lucide-react";

export function InvoiceFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-primary mb-4">SavannahPrime Agency</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-md leading-relaxed">
              Premium invoicing and quotation solutions for innovative businesses. Create and manage professional documents with ease.
            </p>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} SavannahPrime Agency. All rights reserved.</p>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </button>
              </li>
              <li>
                <button className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Support
                </button>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+1234567890" className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +123 456 7890
                </a>
              </li>
              <li>
                <a href="mailto:info@savannahprime.com" className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@savannahprime.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}