import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reportes = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoMantenimiento, setTipoMantenimiento] = useState('interno');
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [componenteSeleccionado, setComponenteSeleccionado] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  // Lista de opciones para los selectores
  const proveedores = ['Proveedor1', 'Proveedor2', 'Proveedor3'];
  const componentes = ['Componente1', 'Componente2', 'Componente3'];
  const equipos = ['Equipo1', 'Equipo2', 'Equipo3'];

  // Función para obtener los datos del reporte
  const fetchReportData = async () => {
    // Validar que haya un rango de fechas seleccionado
    if (!fechaInicio || !fechaFin) return;

    try {
      const filtros = {
        fechaInicio,
        fechaFin,
        tipoMantenimiento,
        proveedor: proveedorSeleccionado,
        componente: componenteSeleccionado,
        equipo: equipoSeleccionado
      };

      const response = await fetch('http://tu-api/reportes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros)
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Actualizar datos cuando cambien los filtros
  useEffect(() => {
    fetchReportData();
  }, [fechaInicio, fechaFin, tipoMantenimiento, proveedorSeleccionado, componenteSeleccionado, equipoSeleccionado]);

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Título
    pdf.setFontSize(18);
    pdf.text('Reporte de Mantenimientos', pageWidth / 2, 20, { align: 'center' });

    // Filtros aplicados
    pdf.setFontSize(12);
    pdf.text('Filtros aplicados:', 20, 40);
    pdf.text(`Período: ${fechaInicio} - ${fechaFin}`, 20, 50);
    pdf.text(`Tipo de Mantenimiento: ${tipoMantenimiento}`, 20, 60);
    pdf.text(`Proveedor: ${proveedorSeleccionado || 'Todos'}`, 20, 70);
    pdf.text(`Componente: ${componenteSeleccionado || 'Todos'}`, 20, 80);
    pdf.text(`Equipo: ${equipoSeleccionado || 'Todos'}`, 20, 90);

    // Capturar y agregar el gráfico
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 100, 190, 100);
    }

    // Agregar tabla de datos
    pdf.setFontSize(10);
    let yPos = 210;
    chartData.forEach((item) => {
      pdf.text(`${item.mes}: ${item.total} mantenimientos`, 20, yPos);
      yPos += 10;
    });

    pdf.save('reporte-mantenimientos.pdf');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <nav className="flex flex-col gap-2 p-4">
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-left hover:bg-blue-600">
            Inicio
          </button>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-left hover:bg-blue-600">
            Equipos
          </button>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-left hover:bg-blue-600">
            Mantenimientos
          </button>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-left hover:bg-blue-600">
            Reportes
          </button>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-left hover:bg-blue-600 mt-auto">
            Regresar
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Reportes</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Elija los filtros:</h2>
          
          <div className="grid gap-6">
            {/* Fecha */}
            <div className="flex items-center gap-4">
              <label className="whitespace-nowrap">Fecha:</label>
              <input
                type="date"
                className="border rounded px-3 py-1"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <span>a</span>
              <input
                type="date"
                className="border rounded px-3 py-1"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            {/* Tipo de Mantenimiento */}
            <div className="flex items-center gap-4">
              <label>Tipo de Mantenimiento:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipoMantenimiento"
                    value="interno"
                    checked={tipoMantenimiento === 'interno'}
                    onChange={(e) => setTipoMantenimiento(e.target.value)}
                  />
                  Interno
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipoMantenimiento"
                    value="externo"
                    checked={tipoMantenimiento === 'externo'}
                    onChange={(e) => setTipoMantenimiento(e.target.value)}
                  />
                  Externo
                </label>
              </div>
            </div>

            {/* Proveedores */}
            <div className="flex items-center gap-4">
              <label>Proveedores:</label>
              <div className="relative">
                <select
                  className="border rounded px-3 py-1 pr-8 appearance-none bg-white"
                  value={proveedorSeleccionado}
                  onChange={(e) => setProveedorSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor} value={proveedor}>
                      {proveedor}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Componentes */}
            <div className="flex items-center gap-4">
              <label>Componentes:</label>
              <div className="relative">
                <select
                  className="border rounded px-3 py-1 pr-8 appearance-none bg-white"
                  value={componenteSeleccionado}
                  onChange={(e) => setComponenteSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {componentes.map((componente) => (
                    <option key={componente} value={componente}>
                      {componente}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Equipos */}
            <div className="flex items-center gap-4">
              <label>Equipos:</label>
              <div className="relative">
                <select
                  className="border rounded px-3 py-1 pr-8 appearance-none bg-white"
                  value={equipoSeleccionado}
                  onChange={(e) => setEquipoSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {equipos.map((equipo) => (
                    <option key={equipo} value={equipo}>
                      {equipo}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={generatePDF}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow" ref={chartRef}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#2196F3" name="Mantenimientos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;