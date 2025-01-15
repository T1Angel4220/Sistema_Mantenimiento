'use client'

import html2canvas from 'html2canvas';

import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import Badge from '../components/ui/badge';
import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"
import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { jsPDF } from 'jspdf';

import PDFDownloadButton from './pdf-download-button'; // Adjust path as needed
import { Home, ShoppingCart, Box, PenTool, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BAR_COLORS = [
  '#FF6B6B', // coral red
  '#4ECDC4', // turquoise
  '#45B7D1', // sky blue
  '#96CEB4', // sage green
  '#FFEEAD', // cream yellow
  '#D4A5A5', // dusty rose
  '#9B5DE5', // purple
  '#00BBF9', // bright blue
  '#00F5D4', // mint
  '#FEE440'  // yellow
];

const ReportesMantenimiento = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: Box, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/Reporte' },
  ];
  const [fechaRango, setFechaRango] = useState([null, null]);
  const [mantenimiento, setMantenimiento] = useState('');
  const [equipo, setEquipo] = useState('');
  const [tipoActivo, setTipoActivo] = useState('');
  const [actividad, setActividad] = useState('');
  const [componente, setComponente] = useState('');
  const [estado, setEstado] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);
  const [mantenimientosLista, setMantenimientosLista] = useState([]);
  const [equiposLista, setEquiposLista] = useState([]);
  const [actividadesLista, setActividadesLista] = useState([]);
  const [componentesLista, setComponentesLista] = useState([]);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const actividadesChartRef = useRef(null);
  const componentesChartRef = useRef(null);
  const resumenChartRef = useRef(null);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const captureChart = async (chartRef) => {
    if (!chartRef.current) {
      console.warn('Chart ref is not available');
      return null;
    }

    try {
      // Wait for chart animations to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(chartRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: true,
        onclone: (clonedDoc) => {
          // Ensure the cloned element is visible
          const clonedElement = clonedDoc.querySelector(`#${chartRef.current.id}`);
          if (clonedElement) {
            clonedElement.style.visibility = 'visible';
            clonedElement.style.display = 'block';
            clonedElement.style.position = 'relative';
            clonedElement.style.width = '100%';
            clonedElement.style.height = '100%';
          }
        }
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  // Function to capture all charts
  const captureAllCharts = async () => {
    try {
      const [actividades, componentes, resumen] = await Promise.all([
        captureChart(actividadesChartRef),
        captureChart(componentesChartRef),
        captureChart(resumenChartRef)
      ]);

      return {
        actividades,
        componentes,
        resumen
      };
    } catch (error) {
      console.error('Error capturing charts:', error);
      return {
        actividades: null,
        componentes: null,
        resumen: null
      };
    }
  };

  // Cargar datos iniciales y lista de mantenimientos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [mantenimientosResponse, equiposResponse, actividadesResponse, componentesResponse, datosResponse] =
          await Promise.all([
            axios.get('http://localhost:8000/api/lista-mantenimientos'),
            axios.get('http://localhost:8000/api/equipos-mantenimiento'),
            axios.get('http://localhost:8000/api/actividades'),
            axios.get('http://localhost:8000/api/componentes'),
            axios.get('http://localhost:8000/api/mantenimientos') // Cargar datos iniciales
          ]);

        setMantenimientosLista(mantenimientosResponse.data);
        setEquiposLista(equiposResponse.data);
        setActividadesLista(actividadesResponse.data);
        setComponentesLista(componentesResponse.data);
        setResultados(datosResponse.data); // Establecer datos iniciales
        setError(null);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchMantenimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct the params object with all filters
      const params = {
        fechaInicio: fechaRango[0] ? fechaRango[0].toISOString().split('T')[0] : null,
        fechaFin: fechaRango[1] ? fechaRango[1].toISOString().split('T')[0] : null,
        tipo: mantenimiento || null,
        estado: estado || null,
        equipo: equipo || null,
        actividad: actividad || null,
        tipoActivo: tipoActivo || null,
        componente: componente || null
      };

      // Remove null values from params
      Object.keys(params).forEach(key => params[key] === null && delete params[key]);

      // If we have a date range, ensure we're searching for maintenance records that:
      // - Start within the range
      // - End within the range
      // - Span across the range
      if (params.fechaInicio && params.fechaFin) {
        const response = await axios.get('http://localhost:8000/api/mantenimientos', {
          params: {
            ...params,
            includeOverlapping: true // Add this flag to tell backend to include overlapping records
          }
        });
        setResultados(response.data);
      } else {
        // If no date range, proceed with normal filtering
        const response = await axios.get('http://localhost:8000/api/mantenimientos', { params });
        setResultados(response.data);
      }
    } catch (error) {
      console.error('Error al buscar mantenimientos:', error);
      setError('Error al buscar mantenimientos. Por favor, intente nuevamente.');
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };
    // Genera un PDF con jsPDF
 
  const handleClearFilters = async () => {
    // Clear all filter states
    setFechaRango([null, null]);
    setMantenimiento('');
    setEquipo('');
    setTipoActivo('');
    setActividad('');
    setComponente('');
    setEstado('');

    // Close the modal
    setModalOpen(false);
    setSelectedReport(null);

    // Fetch all maintenance records immediately
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/mantenimientos');
      setResultados(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar mantenimientos:', error);
      setError('Error al cargar los mantenimientos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (report) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/mantenimientoDetalles/${report.id}`);
      setSelectedReport(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      setError('No se pudieron cargar los detalles del mantenimiento. Por favor, intente de nuevo.');
    }
  };

  useEffect(() => {
    fetchMantenimientos();
  }, [fechaRango, mantenimiento, equipo, tipoActivo, actividad, componente, estado]);

  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-[#1a374d] text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 space-y-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
          alt="Logo SK Telecom"
          className="h-12 w-auto"
        />
      </div>
      <nav className="space-y-1 px-3 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              className="w-full flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => navigate(item.route)}
            >
              <Icon className="mr-2 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 mt-auto">
        <button
          className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          onClick={() => navigate('/Main')}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Regresar
        </button>
      </div>
    </aside>

    {/* Wrap the existing content */}
    <main className="flex-1 p-8">
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
<h1 style={{ 
  textAlign: 'center', 
  marginBottom: '20px', 
  color: '#4A90E2', 
  fontFamily: 'Arial, sans-serif', 
  fontSize: '2.5em', 
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' 
}}>
  Reportes Mantenimientos
</h1>
      {/* Filtros */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Filtros de Reporte</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {/* Rango de Fechas */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Rango de Fechas</label>
            <DatePicker
              selected={fechaRango[0]}
              onChange={(dates) => setFechaRango(dates)}
              startDate={fechaRango[0]}
              endDate={fechaRango[1]}
              selectsRange
              placeholderText="Seleccionar rango de fechas"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* Mantenimiento */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Mantenimiento</label>
            <select
              value={mantenimiento}
              onChange={(e) => setMantenimiento(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar mantenimiento</option>
              {mantenimientosLista.map((item) => (
                <option key={item.id} value={item.codigo_mantenimiento}>
                  {item.codigo_mantenimiento}
                </option>
              ))}
            </select>
          </div>

          {/* Equipo */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Activos</label>
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar Activo</option>
              {equiposLista.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Mantenimiento */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Tipo de Mantenimiento</label>
            <select
              value={tipoActivo}
              onChange={(e) => setTipoActivo(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar tipo de activo</option>
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </select>
          </div>

          {/* Actividad */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Actividad</label>
            <select
              value={actividad}
              onChange={(e) => setActividad(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar actividad</option>
              {actividadesLista.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Componente */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Componente</label>
            <select
              value={componente}
              onChange={(e) => setComponente(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar componente</option>
              {componentesLista.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar estado</option>
              <option value="Terminado">Terminado</option>
              <option value="No terminado">No terminado</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={fetchMantenimientos}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Buscar
          </button>
          <button
            onClick={handleClearFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Borrar Filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Resultados del Reporte</h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <p>Cargando...</p>
        ) : resultados.length === 0 ? (
          <p>No se encontraron resultados</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Código</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Tipo</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Fecha Inicio</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Fecha Fin</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado) => (
                <tr
                  key={resultado.id}
                  onClick={() => handleRowClick(resultado)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    ':hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.id}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.codigo_mantenimiento}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.tipo}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.fecha_inicio}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.fecha_fin}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detalles del Mantenimiento - Modal Mejorado */}
      {modalOpen && selectedReport && (
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Hoja de Vida del Reporte</CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="equipos">Activos ({selectedReport.equipos?.length || 0})</TabsTrigger>
                <TabsTrigger value="resumen">Resumen</TabsTrigger>
                <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
                <PDFDownloadButton
                  selectedReport={selectedReport}
                  actividadesChartRef={actividadesChartRef}
                  componentesChartRef={componentesChartRef}
                  resumenChartRef={resumenChartRef}
                />
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Código</p>
                        <p className="text-sm">{selectedReport.codigo_mantenimiento}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Tipo</p>
                        <p className="text-sm">{selectedReport.tipo}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Fecha Inicio</p>
                        <p className="text-sm">{selectedReport.fecha_inicio}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Fecha Fin</p>
                        <p className="text-sm">{selectedReport.fecha_fin}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Estado</p>
                        <Badge variant={selectedReport.estado === 'Terminado' ? 'default' : 'secondary'}>
                          {selectedReport.estado}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Responsable</p>
                        <p className="text-sm">{selectedReport.nombre_responsable} {selectedReport.apellido_responsable}</p>
                      </div>
                      {selectedReport.proveedor && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Proveedor</p>
                          <p className="text-sm">{selectedReport.proveedor}</p>
                        </div>
                      )}
                      {selectedReport.costo && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Costo</p>
                          <p className="text-sm">${selectedReport.costo}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="equipos">
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {selectedReport.equipos?.map((equipo, index) => (
                      <AccordionItem key={equipo.id} value={`equipo-${equipo.id}`} className="border rounded-lg">
                        <AccordionTrigger className="px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {equipo.Nombre_Producto || 'No especificado'}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {/* Actividades */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Actividades Realizadas</h4>
                              {equipo.actividades && equipo.actividades.length > 0 ? (
                                <ul className="space-y-1">
                                  {equipo.actividades.map((actividad) => (
                                    <li key={actividad.id} className="text-sm flex items-center gap-2">
                                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                      {actividad.nombre}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">No hay actividades registradas</p>
                              )}
                            </div>

                            <Separator />

                            {/* Componentes */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Componentes Utilizados</h4>
                              {equipo.componentes && equipo.componentes.length > 0 ? (
                                <ul className="space-y-1">
                                  {equipo.componentes.map((componente) => (
                                    <li key={componente.id} className="text-sm flex items-center gap-2">
                                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                      {componente.nombre} - Cantidad: {componente.cantidad || 'No especificada'}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">No hay componentes registrados</p>
                              )}
                            </div>

                            <Separator />

                            {/* Observaciones */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Observaciones</h4>
                              <p className="text-sm bg-muted p-2 rounded">
                                {equipo.observacion || 'No hay observaciones registradas'}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="resumen">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Resumen General</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm font-medium">Total de Activos</p>
                            <p className="text-2xl font-bold">{selectedReport.equipos?.length || 0}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm font-medium">Total de Actividades</p>
                            <p className="text-2xl font-bold">
                              {selectedReport.equipos?.reduce((total, equipo) =>
                                total + (equipo.actividades?.length || 0), 0
                              )}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm font-medium">Total de Componentes</p>
                            <p className="text-2xl font-bold">
                              {selectedReport.equipos?.reduce((total, equipo) =>
                                total + (equipo.componentes?.length || 0), 0
                              )}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm font-medium">Duración</p>
                            <p className="text-2xl font-bold">
                              {Math.ceil((new Date(selectedReport.fecha_fin) - new Date(selectedReport.fecha_inicio)) / (1000 * 60 * 60 * 24))} días
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="estadisticas">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Actividades Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Actividades por Activo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center">
                            <div
                              ref={actividadesChartRef}
                              id="actividadesChart"
                              className="relative h-[400px] w-full"
                              style={{
                                minWidth: '900px',
                                maxWidth: '100%',
                                overflow: 'visible',
                                display: 'block',
                                visibility: 'visible'
                              }}
                            >
                              <BarChart
                                width={900}
                                height={400}
                                data={selectedReport?.equipos?.map(equipo => ({
                                  name: equipo.Nombre_Producto,
                                  actividades: equipo.actividades?.length || 0
                                })) || []}
                                margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                  dataKey="name"
                                  angle={-35}
                                  textAnchor="end"
                                  height={120}
                                  interval={0}
                                  tick={{
                                    fontSize: 12,
                                    fill: '#666',
                                    fontFamily: 'Arial'
                                  }}
                                />
                                <YAxis
                                  tick={{
                                    fontSize: 12,
                                    fill: '#666',
                                    fontFamily: 'Arial'
                                  }}
                                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}
                                />
                                <Legend
                                  verticalAlign="top"
                                  height={36}
                                  iconType="circle"
                                  iconSize={10}
                                  wrapperStyle={{
                                    paddingBottom: '20px'
                                  }}
                                />
                                <Bar
                                  dataKey="actividades"
                                  name="Número de Actividades"
                                  radius={[4, 4, 0, 0]}
                                  barSize={40}
                                >
                                  {selectedReport?.equipos?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                              <button
                                onClick={() => {
                                  setSelectedChart('actividades');
                                  setShowChartModal(true);
                                }}
                                className="absolute bottom-4 right-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                              >
                                Ver gráfico completo
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Componentes Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Componentes por Activo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center">
                            <div
                              ref={componentesChartRef}
                              id="componentesChart"
                              className="relative h-[400px] w-full"
                              style={{
                                minWidth: '900px',
                                maxWidth: '100%',
                                overflow: 'visible',
                                display: 'block',
                                visibility: 'visible'
                              }}
                            >
                              <BarChart
                                width={900}
                                height={400}
                                data={selectedReport?.equipos?.map(equipo => ({
                                  name: equipo.Nombre_Producto,
                                  componentes: equipo.componentes?.length || 0
                                })) || []}
                                margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                  dataKey="name"
                                  angle={-35}
                                  textAnchor="end"
                                  height={120}
                                  interval={0}
                                  tick={{
                                    fontSize: 12,
                                    fill: '#666',
                                    fontFamily: 'Arial'
                                  }}
                                />
                                <YAxis
                                  tick={{
                                    fontSize: 12,
                                    fill: '#666',
                                    fontFamily: 'Arial'
                                  }}
                                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}
                                />
                                <Legend
                                  verticalAlign="top"
                                  height={36}
                                  iconType="circle"
                                  iconSize={10}
                                  wrapperStyle={{
                                    paddingBottom: '20px'
                                  }}
                                />
                                <Bar
                                  dataKey="componentes"
                                  name="Número de Componentes"
                                  radius={[4, 4, 0, 0]}
                                  barSize={40}
                                >
                                  {selectedReport?.equipos?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                              <button
                                onClick={() => {
                                  setSelectedChart('componentes');
                                  setShowChartModal(true);
                                }}
                                className="absolute bottom-4 right-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                              >
                                Ver gráfico completo
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Resumen Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Resumen General del Mantenimiento</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div
                            ref={resumenChartRef}
                            id="resumenChart"
                            className="relative h-[500px] w-full"
                            style={{
                              minWidth: '800px',
                              maxWidth: '100%',
                              overflow: 'visible',
                              display: 'block',
                              visibility: 'visible'
                            }}
                          >
                            <PieChart width={800} height={500}>
                              <Pie
                                data={[
                                  {
                                    name: 'Activos',
                                    value: selectedReport.equipos?.length || 0,
                                    label: `Total de Activos: ${selectedReport.equipos?.length || 0}`
                                  },
                                  {
                                    name: 'Actividades',
                                    value: selectedReport.equipos?.reduce((total, equipo) =>
                                      total + (equipo.actividades?.length || 0), 0
                                    ),
                                    label: `Total de Actividades: ${selectedReport.equipos?.reduce((total, equipo) =>
                                      total + (equipo.actividades?.length || 0), 0
                                    )}`
                                  },
                                  {
                                    name: 'Componentes',
                                    value: selectedReport.equipos?.reduce((total, equipo) =>
                                      total + (equipo.componentes?.length || 0), 0
                                    ),
                                    label: `Total de Componentes: ${selectedReport.equipos?.reduce((total, equipo) =>
                                      total + (equipo.componentes?.length || 0), 0
                                    )}`
                                  },
                                  {
                                    name: 'Días',
                                    value: Math.ceil((new Date(selectedReport.fecha_fin)- new Date(selectedReport.fecha_inicio)) / (1000 * 60*60 * 24)),
                                    label: `Duración: ${Math.ceil((new Date(selectedReport.fecha_fin) - new Date(selectedReport.fecha_inicio)) / (1000 * 60 * 60 * 24))} días`
                                  }
                                ]}
                                cx={400}
                                cy={250}
                                innerRadius={100}
                                outerRadius={160}
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={true}
                                label={({ label }) => label}
                              >
                                {[0, 1, 2, 3].map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#fff"
                                    strokeWidth={2}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value, name) => [`${value}`, name]}
                                contentStyle={{
                                  backgroundColor: 'rgba(255, 255,255, 0.96)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              />
                              <Legend verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={10}
                              />
                            </PieChart>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      {/* Modal para gráfico completo */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90vw] h-[90vh]">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedChart === 'actividades' ? 'Actividades por Activo' : 'Componentes por Activo'}</h3>
              <button onClick={() => setShowChartModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="h-[calc(90vh-100px)]">
              {selectedChart === 'actividades' ? (
                <BarChart
                  width={window.innerWidth * 0.85}
                  height={window.innerHeight * 0.8}
                  data={selectedReport?.equipos?.map(equipo => ({
                    name: equipo.Nombre_Producto,
                    actividades: equipo.actividades?.length || 0
                  })) || []}
                  margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tick={{
                      fontSize: 12,
                      fill: '#666',
                      fontFamily: 'Arial'
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: '#666',
                      fontFamily: 'Arial'
                    }}
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.96)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={10}
                  />
                  <Bar
                    dataKey="actividades"
                    name="Número de Actividades"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  >
                    {selectedReport?.equipos?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  width={window.innerWidth * 0.85}
                  height={window.innerHeight * 0.8}
                  data={selectedReport?.equipos?.map(equipo => ({
                    name: equipo.Nombre_Producto,
                    componentes: equipo.componentes?.length || 0
                  })) || []}
                  margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tick={{
                      fontSize: 12,
                      fill: '#666',
                      fontFamily: 'Arial'
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: '#666',
                      fontFamily: 'Arial'
                    }}
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.96)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={10}
                  />
                  <Bar
                    dataKey="componentes"
                    name="Número de Componentes"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  >
                    {selectedReport?.equipos?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  </div>
  );
};

export default ReportesMantenimiento;

