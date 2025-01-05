import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, ShoppingCart, Box, PenTool, FileText, LogOut } from 'lucide-react';
import './main.css';

const Main = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      getEquipos();
    }
  }, [navigate]);

  const getEquipos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/equipos');
      const equipos = response.data;
      setEquipos(equipos);
      setFilteredEquipos(equipos);
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
    }
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);

    let filtered = [...equipos];

    if (newFilters.Tipo_Equipo) {
      filtered = filtered.filter((equipo) => equipo.Tipo_Equipo === newFilters.Tipo_Equipo);
    }
    if (newFilters.Ubicacion_Equipo) {
      filtered = filtered.filter((equipo) => equipo.Ubicacion_Equipo === newFilters.Ubicacion_Equipo);
    }
    if (newFilters.Estado_Equipo) {
      filtered = filtered.filter((equipo) => equipo.Estado_Equipo === newFilters.Estado_Equipo);
    }
    if (newFilters.Orden_Fecha) {
      filtered = filtered.sort((a, b) => {
        const fechaA = new Date(a.Fecha_Adquisicion);
        const fechaB = new Date(b.Fecha_Adquisicion);
        return newFilters.Orden_Fecha === "Reciente" ? fechaB - fechaA : fechaA - fechaB;
      });
    }
    setFilteredEquipos(filtered);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const totalPages = Math.ceil(filteredEquipos.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const displayedEquipos = filteredEquipos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: Box, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/reportes' },
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

      <div className="flex-1">
        <div className="main-content">
          <div className="main-header">
            <h1 className="main-header-title">Bienvenido al Sistema de Gestión de Mantenimientos</h1>
          </div>

          {/* Sección de "Últimos Registros" */}
          <div className="main-cards-horizontal">
            <h2 className="main-card-title">Últimos Registros</h2>
            <div className="main-horizontal-container">
              {equipos.length > 0 ? (
                equipos
                  .sort((a, b) => b.id - a.id)
                  .slice(0, 5)
                  .map((equipo, index) => (
                    <div className="main-horizontal-card" key={index}>
                      <strong>{equipo.Nombre_Producto}</strong>
                      <br />
                      <span>Registrado el: {new Date(equipo.created_at).toLocaleDateString()}</span>
                    </div>
                  ))
              ) : (
                <p className="main-card-text">No hay equipos registrados.</p>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="filter-container">
            <h3 className="main-card-title">Filtrado : </h3>

            <select
              onChange={(e) => handleFilterChange('Tipo_Equipo', e.target.value)}
              className="filter-select"
            >
              <option value="">Filtrar por Tipo</option>
              <option value="Informático">Informático</option>
              <option value="Electrónicos y Eléctricos">Electrónicos y Eléctricos</option>
              <option value="Industriales">Industriales</option>
              <option value="Audiovisuales">Audiovisuales</option>
            </select>

            <select
              onChange={(e) => handleFilterChange('Ubicacion_Equipo', e.target.value)}
              className="filter-select"
            >
              <option value="">Filtrar por Ubicación</option>
              <option value="Departamento de TI">Departamento de TI</option>
              <option value="Laboratorio de Redes">Laboratorio de Redes</option>
              <option value="Sala de reuniones">Sala de reuniones</option>
              <option value="Laboratorio CTT">Laboratorio CTT</option>
            </select>

            <select
              onChange={(e) => handleFilterChange('Estado_Equipo', e.target.value)}
              className="filter-select"
            >
              <option value="">Filtrar por Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="En reparación">En reparación</option>
            </select>

            <select
              onChange={(e) => handleFilterChange('Orden_Fecha', e.target.value)}
              className="filter-select"
            >
              <option value="">Ordenar por Fecha</option>
              <option value="Reciente">Más reciente</option>
              <option value="Antigua">Más antigua</option>
            </select>
          </div>

          {/* Tabla */}
          <div className="main-table-container">
            <table className="main-table">
              <thead>
                <tr>
                  <th className="main-th">Nombre del Equipo</th>
                  <th className="main-th">Tipo</th>
                  <th className="main-th">Ubicación</th>
                  <th className="main-th">Estado</th>
                  <th className="main-th">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {displayedEquipos.length > 0 ? (
                  displayedEquipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td className="main-td">{equipo.Nombre_Producto}</td>
                      <td className="main-td">{equipo.Tipo_Equipo}</td>
                      <td className="main-td">{equipo.Ubicacion_Equipo}</td>
                      <td className="main-td">{equipo.Estado_Equipo}</td>
                      <td className="main-td">{equipo.Fecha_Adquisicion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="main-td">No hay equipos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Anterior
            </button>
            {totalPages <= 26 ? (
              [...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))
            ) : (
              <>
                {[...Array(23)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </button>
                ))}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      const extraPages = document.getElementById('extra-pages');
                      extraPages.classList.toggle('hidden');
                    }}
                  >
                    ...
                  </button>
                  <div id="extra-pages" className="extra-pages-menu hidden">
                    {[...Array(totalPages - 23)].map((_, index) => {
                      const pageNumber = index + 24;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => {
                            handlePageChange(pageNumber);
                            document.getElementById('extra-pages').classList.add('hidden');
                          }}
                          className={currentPage === pageNumber ? 'active' : ''}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showLogoutModal && (
        <div className="main-modal-overlay">
          <div className="main-modal-content">
            <h3>¿Está seguro de que desea cerrar sesión?</h3>
            <div className="main-modal-buttons">
              <button className="main-confirm-button" onClick={confirmLogout}>
                Sí
              </button>
              <button className="main-cancel-button" onClick={cancelLogout}>
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

