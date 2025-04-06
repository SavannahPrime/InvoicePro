interface DocumentTypeToggleProps {
  isQuotation: boolean;
  onToggle: (isQuotation: boolean) => void;
}

export function DocumentTypeToggle({ isQuotation, onToggle }: DocumentTypeToggleProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
      <div className="flex items-center justify-center">
        <span className="relative inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => onToggle(false)}
            className={`relative inline-flex items-center px-6 py-2 border text-sm font-medium rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 ${
              !isQuotation
                ? "text-white bg-primary hover:bg-primary-700 border-transparent"
                : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
            }`}
          >
            Invoice
          </button>
          <button
            type="button"
            onClick={() => onToggle(true)}
            className={`relative inline-flex items-center px-6 py-2 border text-sm font-medium rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 ${
              isQuotation
                ? "text-white bg-primary hover:bg-primary-700 border-transparent"
                : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
            }`}
          >
            Quotation
          </button>
        </span>
      </div>
    </div>
  );
}
