import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RegistrarMantenimiento from './RegistrarMantenimiento'; // Importar el componente
import './MostrarMantenimientos.css';

const endpoint = 'http://localhost:8000/api/mantenimientos';

const MostrarMantenimientos = () => {
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    responsable: '',
    tipo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showFilters, setShowFilters] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Estado para el modal de registro

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

  const handleRegisterClick = () => {
    setShowRegisterModal(true); // Mostrar el modal
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false); // Ocultar el modal
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    setIdToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${endpoint}/${idToDelete}`);
      setMantenimientos((prevMantenimientos) =>
        prevMantenimientos.filter((mantenimiento) => mantenimiento.id !== idToDelete)
      );
      setShowModal(false);

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1500);
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handleCheckboxChange = () => {
    setShowFilters(!showFilters);
  };

  const filteredMantenimientos = mantenimientos.filter((mantenimiento) => {
    return (
      (showFilters &&
        (filters.fechaInicio === '' || mantenimiento.fecha_inicio.includes(filters.fechaInicio)) &&
        (filters.fechaFin === '' || mantenimiento.fecha_fin.includes(filters.fechaFin)) &&
        (filters.descripcion === '' || (mantenimiento.descripcion && mantenimiento.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase()))) &&
        (filters.responsable === '' || mantenimiento.responsable.toLowerCase().includes(filters.responsable.toLowerCase())) &&
        (filters.tipo === '' || mantenimiento.tipo.toLowerCase().includes(filters.tipo.toLowerCase()))
      ) || !showFilters
    );
  });

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
          <label>Aplicar filtros de busqueda</label>
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
                    <button className='btn btn-eliminar' onClick={() => handleDelete(mantenimiento.id)}>Eliminar</button>
                    <button className='btn btn-editar'>Editar</button>
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
        <button className="btn btn-create" onClick={handleRegisterClick}>
          Registrar mantenimiento
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>¿Estás seguro de que deseas eliminar este mantenimiento?</h3>
            <div className="modal-buttons">
              <button className="btn btn-eliminar" onClick={confirmDelete}>Confirmar</button>
              <button className="btn btn-editar" onClick={cancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="modal ">
          <div className="modal-content registro">
            <RegistrarMantenimiento onClose={handleCloseRegisterModal} />
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="success-message">
          <p>El mantenimiento fue eliminado con éxito.</p>
        </div>
      )}
    </div>
  );
};

export default MostrarMantenimientos;
