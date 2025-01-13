// src/components/PaginationControls.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-l-md disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-r-md disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default PaginationControls;
