'use client'

import { useState } from 'react'
import { MaintenanceReportPDF } from './maintenance-report-pdf'

export function PDFButton({ data }) {
  const [showPDF, setShowPDF] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowPDF(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
      >
        Generar PDF
      </button>

      {showPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90vw] h-[90vh]">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">Vista Previa del PDF</h3>
              <button 
                onClick={() => setShowPDF(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <MaintenanceReportPDF data={data} />
          </div>
        </div>
      )}
    </>
  )
}

