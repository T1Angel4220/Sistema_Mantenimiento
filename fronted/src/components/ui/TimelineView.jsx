import React from "react";
import { PenTool } from "lucide-react";

function TimelineView({ mantenimientos, onSelectMant, currentPage, itemsPerPage }) {
  // Dividir los mantenimientos en páginas.
  const paginatedMantenimientos = mantenimientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative">
      {/* Línea vertical del timeline */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <ul className="space-y-6">
        {paginatedMantenimientos.map((mant) => (
          <li key={mant.codigo_mantenimiento} className="relative pl-10">
            {/* Ícono del timeline */}
            <div className="absolute left-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
                        {/* Ícono redondeado con el ícono de PenTool */}

            <div className="timeline-item-icon">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            {/* Botón con detalles del mantenimiento */}
            <button
              type="button"
              className="w-full text-left focus:outline-none hover:bg-gray-100 p-2 rounded-lg transition"
              onClick={() => onSelectMant(mant.codigo_mantenimiento)}
            >
              <div>
                <p className="font-medium text-gray-800">{mant.codigo_mantenimiento}</p>
                <p className="text-sm text-gray-500">{mant.fecha_inicio}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimelineView;
