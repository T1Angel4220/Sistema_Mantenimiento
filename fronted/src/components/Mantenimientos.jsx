import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MostrarMantenimientos.css';

const endpoint = 'http://localhost:8000/api/mantenimientos';

const MostrarMantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    responsable: '',
    tipo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de elementos por página
  const [showFilters, setShowFilters] = useState(false); // Estado para mostrar/ocultar filtros

  useEffect(() => {
    getAllMantenimientos();
  }, []);

  const getAllMantenimientos = async () => {
    try {
      const response = await axios.get(endpoint);
      setMantenimientos(response.data);
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setCurrentPage(1); // Resetear a la primera página al cambiar filtros
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${endpoint}/${id}`);
      // Eliminar el mantenimiento de la lista local sin necesidad de recargar
      setMantenimientos((prevMantenimientos) =>
        prevMantenimientos.filter((mantenimiento) => mantenimiento.id !== id)
      );
      getAllMantenimientos(); // Recargar la lista de mantenimientos
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
    }
  };

  const handleCheckboxChange = () => {
    setShowFilters(!showFilters); // Alternar el estado de mostrar/ocultar filtros
  };

  const filteredMantenimientos = mantenimientos.filter((mantenimiento) => {
    return (
      (showFilters &&
        (filters.fechaInicio === '' || mantenimiento.fecha_inicio.includes(filters.fechaInicio)) &&
        (filters.fechaFin === '' || mantenimiento.fecha_fin.includes(filters.fechaFin)) &&
        (filters.descripcion === '' || (mantenimiento.descripcion && mantenimiento.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase()))) &&
        (filters.responsable === '' || mantenimiento.responsable.toLowerCase().includes(filters.responsable.toLowerCase())) &&
        (filters.tipo === '' || mantenimiento.tipo.toLowerCase().includes(filters.tipo.toLowerCase()))
      ) || !showFilters // Si no se muestran los filtros, no se aplican
    );
  });

  // Lógica para paginación
  const indexOfLastMantenimiento = currentPage * itemsPerPage;
  const indexOfFirstMantenimiento = indexOfLastMantenimiento - itemsPerPage;
  const currentMantenimientos = filteredMantenimientos.slice(indexOfFirstMantenimiento, indexOfLastMantenimiento);

  const totalPages = Math.ceil(filteredMantenimientos.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const isNextButtonDisabled = currentPage === totalPages || filteredMantenimientos.length === 0;

  return (
    <div className="container">
      <h1 className="main-header-title">Listado de Mantenimientos</h1>
      <div className="filters-container">
        <div className="filters-label">
          <label>
            Aplicar filtros de busqueda
          </label>
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={showFilters}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>

      {showFilters && (
        <div className="filters">
          <input
            type="date"
            name="fechaInicio"
            placeholder="Fecha de Inicio"
            value={filters.fechaInicio}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="fechaFin"
            placeholder="Fecha de Fin"
            value={filters.fechaFin}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Filtrar por Descripción"
            value={filters.descripcion}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="responsable"
            placeholder="Filtrar por Responsable"
            value={filters.responsable}
            onChange={handleFilterChange}
          />
          <select
            name="tipo"
            value={filters.tipo}
            onChange={handleFilterChange}
          >
            <option value="">Filtrar por Tipo</option>
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
        </div>
      )}

      <div className="table-container">
        <table className="tableEquipos">
          <thead>
            <tr>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Descripción</th>
              <th>Responsable</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentMantenimientos.length > 0 ? (
              currentMantenimientos.map((mantenimiento) => (
                <tr key={mantenimiento.id}>
                  <td>{mantenimiento.fecha_inicio || 'Sin fecha'}</td>
                  <td>{mantenimiento.fecha_fin || 'Sin fecha'}</td>
                  <td>{mantenimiento.descripcion || 'Sin descripción'}</td>
                  <td>{mantenimiento.responsable || 'Sin responsable'}</td>
                  <td>{mantenimiento.tipo.toUpperCase() || 'No especificado'}</td>
                  <td className="actions">
                    <button className='btn btn-elminar' onClick={() => handleDelete(mantenimiento.id)}>Eliminar</button>
                    <button className='btn btn-editarr'>Editar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay mantenimientos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isNextButtonDisabled}
        >
          Siguiente
        </button>
      </div>
      <div className="button-group">
        <Link to="/Main" className="btn btn-return">Regresar</Link>
        <Link to="/RegistroMentenimiento" className="btn btn-create">Registrar mantenimiento</Link>
      </div>
    </div>
  );
};

export default MostrarMantenimientos;
