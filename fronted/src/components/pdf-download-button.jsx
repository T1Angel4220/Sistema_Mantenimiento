'use client'

import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import 'jspdf-autotable';


export default function PDFDownloadButton({
  selectedReport,
  actividadesChartRef,
  componentesChartRef,
  resumenChartRef
}) {
  const [isGenerating, setIsGenerating] = useState(false)

  const captureChart = useCallback(async (chartRef) => {
    if (!chartRef.current) {
      console.warn('Chart ref is not available');
      return null;
    }

    try {
      // Increase wait time to ensure charts are fully rendered
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Force a repaint before capture
      chartRef.current.style.opacity = '0.99';
      await new Promise(resolve => setTimeout(resolve, 100));
      chartRef.current.style.opacity = '1';

      const canvas = await html2canvas(chartRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: true,
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight * 1.5, // Increase height by 50%
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector(`#${chartRef.current?.id}`);
          if (clonedElement) {
            clonedElement.style.visibility = 'visible';
            clonedElement.style.display = 'block';
            clonedElement.style.position = 'relative';
            clonedElement.style.width = '100%';
            clonedElement.style.height = '100%';
            clonedElement.style.padding = '20px';
            // Remove any unwanted buttons or elements
            const buttons = clonedElement.querySelectorAll('button');
            buttons.forEach(button => button.remove());
          }
        }
      });

      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Error capturing chart:', error);
      alert('Error al capturar el gráfico. Por favor intente nuevamente.');
      return null;
    }
  }, []);

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Ensure charts are visible and rendered
      await new Promise(resolve => setTimeout(resolve, 2000));

      const images = await Promise.all([
        captureChart(actividadesChartRef),
        captureChart(componentesChartRef),
        captureChart(resumenChartRef)
      ]);

      if (!images[0] || !images[1] || !images[2]) {
        throw new Error('No se pudieron capturar todos los gráficos');
      }

      const [actividadesImg, componentesImg, resumenImg] = images;
      

      const doc = new jsPDF();
      
      // Add content with error handling
      try {
        
        // Title page
        doc.setFont("helvetica", "bold");

      // Title with gradient-like effect
// Mejor diseño de encabezado principal
doc.setFillColor(54, 79, 107); // Fondo del encabezado
doc.rect(0, 10, doc.internal.pageSize.width, 20, 'F'); // Rectángulo completo de la página
doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.setTextColor(255, 255, 255); // Texto blanco
doc.text('REPORTE DE MANTENIMIENTOS SK TELECOM', doc.internal.pageSize.width / 2, 23, { align: 'center' });

// Maintenance details with improved layout and design
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(54, 79, 107); // Título en azul oscuro
doc.text('Detalles del Mantenimiento', doc.internal.pageSize.width / 2, 35, { align: 'center' });

doc.setFontSize(12);
doc.setFont("helvetica", "normal");
doc.setTextColor(0); // Texto negro

const detailsY = 45;
const detailRows = [
  { label: 'CÓDIGO:', value: selectedReport?.codigo_mantenimiento || 'N/A' },
  { label: 'TIPO:', value: selectedReport?.tipo || 'N/A' },
  { label: 'INICIO:', value: selectedReport?.fecha_inicio || 'N/A' },
  { label: 'FIN:', value: selectedReport?.fecha_fin || 'N/A' },
];

// Añadir Responsable si el mantenimiento es interno
if (selectedReport?.tipo?.toLowerCase() === 'interno') {
  detailRows.push({
    label: 'RESPONSABLE:',
    value: `${selectedReport?.nombre_responsable} ${selectedReport?.apellido_responsable}` || 'N/A',
  });
}

// Añadir Proveedor y Costo si el mantenimiento es externo
if (selectedReport?.tipo?.toLowerCase() === 'externo') {
  detailRows.push(
    { label: 'PROVEEDOR:', value: selectedReport?.proveedor || 'N/A' },
    { label: 'COSTO:', value: `$${selectedReport?.costo || 'N/A'}` }
  );
}

// Estilo de tabla
const col1X = 20; // Posición inicial de la columna izquierda
const col2X = doc.internal.pageSize.width / 2; // Posición inicial de la columna derecha
const rowHeight = 10;

detailRows.forEach((row, index) => {
  const yPosition = detailsY + (index * rowHeight);

  // Línea divisoria
  if (index !== 0) {
    doc.setDrawColor(240, 240, 240); // Línea gris clara
    doc.line(col1X, yPosition - 5, doc.internal.pageSize.width - col1X, yPosition - 5);
  }

  // Texto de la etiqueta
  doc.setFont("helvetica", "bold");
  doc.text(row.label, col1X, yPosition);

  // Texto del valor
  doc.setFont("helvetica", "normal");
  doc.text(row.value, col2X, yPosition);
});

      

  // General summary table
      // Summary table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(54, 79, 107); // Título en azul oscuro
      doc.text('RESUMEN GENERAL', 20,120);
      doc.setFontSize(14);

  doc.setFontSize(12);
  const tableData = [
    ['TOTAL DE ACTIVOS', 'TOTAL DE ACTIVIDADES', 'TOTAL DE COMPONENTES', 'DURACION'],
    [
      selectedReport?.equipos?.length || '0',
      selectedReport?.equipos?.reduce((total, equipo) => total + (equipo.actividades?.length || 0), 0).toString(),
      selectedReport?.equipos?.reduce((total, equipo) => total + (equipo.componentes?.length || 0), 0).toString(),
      `${Math.ceil((new Date(selectedReport?.fecha_fin) - new Date(selectedReport?.fecha_inicio)) / (1000 * 60 * 60 * 24))} días`
    ]
  ];
// Añadir colores alternos en las filas de las tablas
doc.autoTable({
  startY: 130,
  head: [['TOTAL DE ACTIVOS', 'TOTAL DE ACTIVIDADES', 'TOTAL DE COMPONENTES', 'DURACIÓN']],
  body: [[
    selectedReport?.equipos?.length || '0',
    selectedReport?.equipos?.reduce((total, equipo) => total + (equipo.actividades?.length || 0), 0).toString(),
    selectedReport?.equipos?.reduce((total, equipo) => total + (equipo.componentes?.length || 0), 0).toString(),
    `${Math.ceil((new Date(selectedReport?.fecha_fin) - new Date(selectedReport?.fecha_inicio)) / (1000 * 60 * 60 * 24))} días`
  ]],
  theme: 'grid',
  styles: {
    fillColor: [240, 240, 240], // Fondo gris claro
    textColor: 0, // Texto negro
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255] // Blanco para filas alternas
  }
});
  doc.addImage(resumenImg, 'PNG', 25, 150, 210, 140);
  doc.setTextColor(0); // Texto negro


// Equipment details with cards
doc.addPage();
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(54, 79, 107); // Título en azul oscuro
doc.text('DETALLES DEL MANTENIMIENTO', 20, 20);
doc.setTextColor(0); // Texto negro


let currentY = 40; // Posición inicial en la página
const pageHeight = doc.internal.pageSize.height; // Altura de la página
const cardHeight = 60; // Altura estimada de cada tarjeta
const marginBottom = 10; // Margen adicional al final de la página

selectedReport?.equipos?.forEach((equipo, index) => {
  // Verifica si el contenido cabe en la página
  if (currentY + cardHeight + marginBottom > pageHeight) {
    doc.addPage();
    currentY = 20; // Reinicia la posición en la nueva página
  }

  // Fondo de la tarjeta
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, currentY - 5, doc.internal.pageSize.width - 30, cardHeight, 5, 5, 'F');

  // Título del equipo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Activo: ${index + 1}. ${equipo.Nombre_Producto || 'No especificado'}`, 20, currentY);

  // Actividades (en lista)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const actividades = equipo.actividades?.map((a) => `- ${a.nombre}`).join('\n') || '- Ninguna';
  doc.text(`Actividades:\n${actividades}`, 25, currentY + 10, {
    maxWidth: doc.internal.pageSize.width - 40,
  });

  // Componentes (en lista)
  const componentes = equipo.componentes
    ?.map((c) => `- ${c.nombre} (${c.cantidad})`)
    .join('\n') || '- Ninguno';
  doc.text(`Componentes:\n${componentes}`, 25, currentY + 25, {
    maxWidth: doc.internal.pageSize.width - 40,
  });

  // Observación
  doc.text(`Observación: ${equipo.observacion || 'Sin observaciones'}`, 25, currentY + 45);

  // Incrementa la posición para la siguiente tarjeta
  currentY += cardHeight + 10; // Espaciado entre tarjetas
});


 
      
        // Add charts with proper dimensions
// Charts section with improved layout
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(54, 79, 107); // Título en azul oscuro

      doc.text('GRÁFICOS ESTADÍSTICOS', 20, 15);
      doc.setTextColor(0); // Texto negro

        doc.text('Actividades por Activo', 10, 25);
        doc.addImage(actividadesImg, 'PNG', 8, 30, 215, 180);

        doc.text('Componentes por Activo', 10, 150);
        doc.addImage(componentesImg, 'PNG', 8, 155, 215, 180);
      // Add a footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i); // Go to each page
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10, { align: 'right' });
      }

        doc.save(`mantenimiento-${selectedReport?.codigo_mantenimiento || 'reporte'}.pdf`);
      } catch (error) {
        console.error('Error adding content to PDF:', error);
        throw new Error('Error al generar el contenido del PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intente nuevamente EL QUE FUNCIONABA.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedReport, actividadesChartRef, componentesChartRef, resumenChartRef, captureChart]);

  return (
    <Button 
      onClick={generatePDF}
      disabled={isGenerating}
      variant={isGenerating ? "outline" : "default"}
      className="w-center"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando PDF...
        </>
      ) : (
        'Descargar PDF'
      )}
    </Button>
  )
}
