import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MostrarEquipos.css';

const endpoint = 'http://localhost:8000/api/equipos';

const MostrarEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [filtros, setFiltros] = useState({
    Tipo_Equipo: '',
    Ubicacion_Equipo: '',
    Estado_Equipo: '',
    Orden_Fecha: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [equipoAEliminar, setEquipoAEliminar] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      const response = await axios.get(endpoint);
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  };


const deleteEquipo = async () => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/equipo/${equipoAEliminar.id}`);
    if (response.status === 200) {
      setEquipos(equipos.filter((equipo) => equipo.id !== equipoAEliminar.id));
      setShowModal(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000); // El modal de éxito desaparece después de 3 segundos
    } else {
      alert('Error al eliminar el equipo');
    }
  } catch (error) {
    console.error('Error al eliminar el equipo:', error);
    alert('Hubo un problema al eliminar el equipo');
    setShowModal(false);
  }
};

  const handleFilterChange = (name, value) => {
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  const equiposFiltrados = equipos.filter((equipo) => {
    return (
      (filtros.Tipo_Equipo === '' || equipo.Tipo_Equipo === filtros.Tipo_Equipo) &&
      (filtros.Ubicacion_Equipo === '' || equipo.Ubicacion_Equipo === filtros.Ubicacion_Equipo) &&
      (filtros.Estado_Equipo === '' || equipo.Estado_Equipo === filtros.Estado_Equipo)
    );
  });

  const ordenarEquipos = (equipos) => {
    if (filtros.Orden_Fecha === 'Reciente') {
      return equipos.sort((a, b) => new Date(b.Fecha_Adquisicion) - new Date(a.Fecha_Adquisicion));
    }
    if (filtros.Orden_Fecha === 'Antigua') {
      return equipos.sort((a, b) => new Date(a.Fecha_Adquisicion) - new Date(b.Fecha_Adquisicion));
    }
    return equipos;
  };

  const handleConfirmDelete = (equipo) => {
    setEquipoAEliminar(equipo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
     
      {/* Título y subtítulo */}
      <div className="main-header"> 
        <h1 className="main-header-title">Listado de Equipos</h1>
      </div>
      
      <h2 className="">Filtros de </h2>
      <div className="filters">
        {/* Filtro por Tipo */}
        <div>
          <label htmlFor="Tipo_Equipo">Tipo de Equipo</label>
          <select 
            id="Tipo_Equipo"
            onChange={(e) => handleFilterChange('Tipo_Equipo', e.target.value)} 
            className="filter-select"
          >
            <option value=""></option>
            <option value="Informático">Informático</option>
            <option value="Electrónicos y Eléctricos">Electrónicos y Eléctricos</option>
            <option value="Industriales">Industriales</option>
            <option value="Audiovisuales">Audiovisuales</option>
          </select>
        </div>

        {/* Filtro por Ubicación */}
        <div>
          <label htmlFor="Ubicacion_Equipo">Ubicación del Equipo</label>
          <select 
            id="Ubicacion_Equipo"
            onChange={(e) => handleFilterChange('Ubicacion_Equipo', e.target.value)}
            className="filter-select"
          >
            <option value=""></option>
            <option value="Departamento de TI">Departamento de TI</option>
            <option value="Laboratorio de Redes">Laboratorio de Redes</option>
            <option value="Sala de reuniones">Sala de reuniones</option>
            <option value="Laboratorio CTT">Laboratorio CTT</option>
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label htmlFor="Estado_Equipo">Estado del Equipo</label>
          <select 
            id="Estado_Equipo"
            onChange={(e) => handleFilterChange('Estado_Equipo', e.target.value)} 
            className="filter-select"
          >
            <option value=""></option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En reparación">En reparación</option>
          </select>
        </div>

        {/* Filtro por Orden de Fecha */}
        <div>
          <label htmlFor="Orden_Fecha" >Ordenar por Fecha</label>
          <select 
            id="Orden_Fecha"
            onChange={(e) => handleFilterChange('Orden_Fecha', e.target.value)} 
            className="filter-select"
          >
            <option value=""></option>
            <option value="Reciente">Más reciente</option>
            <option value="Antigua">Más antigua</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="tableEquipos">
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Tipo de Equipo</th>
              <th>Fecha de Adquisición</th>
              <th>Ubicación del Equipo</th>
              <th>Descripción del Equipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equiposFiltrados.length > 0 ? (
              ordenarEquipos(equiposFiltrados).map((equipo) => (
                <tr key={equipo.id}>
                  <td>{equipo.Nombre_Producto}</td>
                  <td>{equipo.Tipo_Equipo}</td>
                  <td>{equipo.Fecha_Adquisicion}</td>
                  <td>{equipo.Ubicacion_Equipo}</td>
                  <td>{equipo.Descripcion_Equipo}</td>
                  <td className="actions">
                    <Link to={`/edit/${equipo.id}`} className="btn btn-warning btn-editar">Editar</Link>
                    <button onClick={() => handleConfirmDelete(equipo)} className="btn btn-danger">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay equipos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación */}
{showModal && (
  <div className="modal">
    <div className="modal-content">
      <p>¿Estás seguro de que deseas eliminar el equipo "{equipoAEliminar.Nombre_Producto}"?</p>
      <div className='modal-buttons'>
        <button onClick={handleCloseModal} className="btn btn-cancelar">Cancelar</button>
        <button onClick={deleteEquipo} className="btn btn-eliminar">Confirmar</button>
      </div>
    </div>
  </div>
)}

{/* Modal de Éxito */}
{showSuccessModal && (
  <div className="modal" >
    <div className="modal-content modal-exito">
      <p>El equipo se eliminó con éxito.</p>
    </div>
  </div>
)}

      <div className="button-group">
        <Link to="/Main" className="btn btn-return">Regresar</Link>
        <Link to="/create" className="btn btn-create">Crear Nuevo Equipo</Link>
      </div>
    </div>
    
  );
};

export default MostrarEquipos;
