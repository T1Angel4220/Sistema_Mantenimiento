import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, ShoppingCart, Box, PenTool, FileText, LogOut, Search } from 'lucide-react';
import './main.css';

const Main = () => {
  const navigate = useNavigate();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [filteredMantenimientos, setFilteredMantenimientos] = useState([]);
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const itemsPerPage = 5;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [codigoFilter, setCodigoFilter] = useState('');
  const [fechaInicioFilter, setFechaInicioFilter] = useState('');
  const [fechaFinFilter, setFechaFinFilter] = useState('');
  const [tipoEquipoFilter, setTipoEquipoFilter] = useState('');
  const [tipoMantenimientoFilter, setTipoMantenimientoFilter] = useState('');
  const [procesoCompraFilter, setProcesoCompraFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      getMantenimientos();
    }
  }, [navigate]);

  const getMantenimientos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/mantenimientos');
      const mantenimientosData = response.data;
      
      setMantenimientos(mantenimientosData);
      setFilteredMantenimientos(mantenimientosData);
      
      const ultimos = [...mantenimientosData]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setUltimosRegistros(ultimos);
    } catch (error) {
      console.error('Error al obtener los mantenimientos:', error);
    }
  };

  useEffect(() => {
    let filtered = [...mantenimientos];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.codigo_mantenimiento?.toLowerCase().includes(search) ||
        item.nombre_equipo?.toLowerCase().includes(search) ||
        item.codigo_barras?.toLowerCase().includes(search)
      );
    }

    if (codigoFilter) {
      filtered = filtered.filter(item =>
        item.codigo_mantenimiento?.toLowerCase().includes(codigoFilter.toLowerCase())
      );
    }

    if (fechaInicioFilter) {
      filtered = filtered.filter(item =>
        new Date(item.fecha_inicio) >= new Date(fechaInicioFilter)
      );
    }

    if (fechaFinFilter) {
      filtered = filtered.filter(item =>
        new Date(item.fecha_fin) <= new Date(fechaFinFilter)
      );
    }

    if (tipoEquipoFilter) {
      filtered = filtered.filter(item =>
        item.tipo_equipo === tipoEquipoFilter
      );
    }

    if (tipoMantenimientoFilter) {
      filtered = filtered.filter(item => item.tipo === tipoMantenimientoFilter);
    }

    if (procesoCompraFilter) {
      filtered = filtered.filter(item =>
        item.proceso_compra_id?.toLowerCase().includes(procesoCompraFilter.toLowerCase())
      );
    }

    if (estadoFilter) {
      filtered = filtered.filter(item => item.estado === estadoFilter);
    }

    setFilteredMantenimientos(filtered);
    setCurrentPage(1);
  }, [searchTerm, codigoFilter, fechaInicioFilter, fechaFinFilter, tipoEquipoFilter, tipoMantenimientoFilter, procesoCompraFilter, estadoFilter, mantenimientos]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const totalPages = Math.ceil(filteredMantenimientos.length / itemsPerPage);
  const displayedMantenimientos = filteredMantenimientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: Box, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/Reporte' },
  ];

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
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Salir
          </button>
        </div>
      </aside>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-[#1a374d] text-white py-4 rounded-lg">
          Bienvenido al Sistema de Gestión de Mantenimientos
        </h1>

        {/* Últimos Registros */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Últimos Registros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ultimosRegistros.map((registro, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">{registro.codigo_mantenimiento}</h3>
                <p className="text-sm text-gray-600">
                  Tipo: {registro.tipo || 'No asignado'}
                </p>
                <p className="text-sm text-gray-500">
                  Registrado el: {new Date(registro.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Buscar</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Código Mantenimiento</label>
            <input
              type="text"
              placeholder="Código..."
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={codigoFilter}
              onChange={(e) => setCodigoFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha Inicio</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fechaInicioFilter}
              onChange={(e) => setFechaInicioFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha Fin</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fechaFinFilter}
              onChange={(e) => setFechaFinFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Tipo de Mantenimiento</label>
            <select
              value={tipoMantenimientoFilter}
              onChange={(e) => setTipoMantenimientoFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </select>
          </div>

         

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Estado del Mantenimiento</label>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Terminado">Terminado</option>
              <option value="No terminado">No terminado</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
          <thead className="bg-[#2f3b52]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Código Mantenimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Cantidad de activos registrados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Fecha de Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Fecha de Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tipo de Mantenimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Estado del Mantenimiento
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedMantenimientos.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.codigo_mantenimiento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.equipos.length || 'No asignado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.fecha_inicio).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.fecha_fin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.tipo === 'Interno' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.estado === 'Terminado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">¿Está seguro de que desea cerrar sesión?</h3>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmLogout}
              >
                Sí
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={cancelLogout}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;

