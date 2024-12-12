import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './main.css';

const Main = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]); // Estado para almacenar todos los equipos
  const [filteredEquipos, setFilteredEquipos] = useState([]); // Estado para los equipos filtrados
  const [filters, setFilters] = useState({}); // Estado para los filtros activos
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Estado del modal para cerrar sesión
  const itemsPerPage = 9; // Número de elementos por página

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
      const response = await axios.get('http://localhost:8000/api/equipos'); // Endpoint para obtener todos los equipos
      const equipos = response.data;

      setEquipos(equipos);
      setFilteredEquipos(equipos); // Inicialmente, todos los equipos están visibles
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
    }
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);

    let filtered = [...equipos]; // Crear una copia para evitar mutaciones

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

        return newFilters.Orden_Fecha === "Reciente"
          ? fechaB - fechaA // Más reciente primero
          : fechaA - fechaB; // Más antigua primero
      });
    }
    setFilteredEquipos(filtered);
  };

  const handleLogout = () => {
    setShowLogoutModal(true); // Mostrar modal de confirmación
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); // Cerrar modal
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

  return (
    <div className="body-main">
      <div className="main-container">
        <div className="main-sidebar">
          <div className="main-sidebar-header">
            <h2 className="main-sidebar-title">SK TELECOM</h2>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
              alt="Logo SK Telecom"
              className="main-sidebar-logo"
            />
          </div>
          <button className="main-sidebar-btn" onClick={() => navigate('/Main')}>
            Inicio
          </button>
          <button className="main-sidebar-btn" onClick={() => navigate('/equipos')}>
            Equipos
          </button>
          <button className="main-sidebar-btn" onClick={() => navigate('/mantenimientos')}>
            Mantenimientos
          </button>
          <button className="main-sidebar-btn" onClick={() => navigate('/reportes')}>
            Reportes
          </button>
          <button className="main-logout-btn" onClick={handleLogout}>
            Salir
          </button>
        </div>

        <div className="main-content">
          <div className="main-header">
            <h1 className="main-header-title">Bienvenido al Sistema</h1>
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
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
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
