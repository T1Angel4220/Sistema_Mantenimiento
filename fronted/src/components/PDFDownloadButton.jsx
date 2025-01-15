'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PDFDownloadButton = ({ selectedReport, actividadesChartRef, componentesChartRef, resumenChartRef }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const captureChart = async (chartRef) => {
    if (!chartRef.current) {
      console.warn('Chart ref is not available');
      return null;
    }
    try {
      const canvas = await html2canvas(chartRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const [actividadesImg, componentesImg, resumenImg] = await Promise.all([
        captureChart(actividadesChartRef),
        captureChart(componentesChartRef),
        captureChart(resumenChartRef),
      ]);

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Reporte de Mantenimiento', 10, 10);

      doc.setFontSize(12);
      doc.text(`Código: ${selectedReport?.codigo_mantenimiento || 'N/A'}`, 10, 20);
      doc.text(`Descripción: ${selectedReport?.descripcion || 'N/A'}`, 10, 30);

      if (actividadesImg) {
        doc.addPage();
        doc.text('Actividades por Equipo', 10, 20);
        doc.addImage(actividadesImg, 'PNG', 10, 30, 180, 100);
      }
      if (componentesImg) {
        doc.addPage();
        doc.text('Componentes por Equipo', 10, 20);
        doc.addImage(componentesImg, 'PNG', 10, 30, 180, 100);
      }
      if (resumenImg) {
        doc.addPage();
        doc.text('Resumen General', 10, 20);
        doc.addImage(resumenImg, 'PNG', 10, 30, 180, 100);
      }

      doc.save(`mantenimiento-${selectedReport?.codigo_mantenimiento || 'reporte'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`btn ${isGenerating ? 'btn-disabled' : 'btn-primary'}`}
    >
      {isGenerating ? 'Generando PDF...' : 'Descargar PDF'}
    </button>
  );
};

export default PDFDownloadButton;
