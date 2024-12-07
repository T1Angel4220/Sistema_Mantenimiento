import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MostrarEquipos.css';

const endpoint = 'http://localhost:8000/api/equipos'; 

const MostrarEquipos = () => {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      const response = await axios.get(endpoint);
      console.log(response.data); // Verifica la respuesta aquí
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  };

  const deleteEquipo = async (id) => {
    // Verifica si el ID está llegando correctamente
    console.log("Eliminar equipo con ID:", id);

    // Confirmación antes de eliminar
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este equipo?');
    if (confirmDelete) {
      try {
        // Realiza la solicitud DELETE para eliminar el equipo
        const response = await axios.delete(`http://localhost:8000/api/equipo/${id}`); // URL correcta para eliminar un equipo

        // Verificar la respuesta del servidor
        console.log("Respuesta de eliminación:", response);

        // Si la eliminación fue exitosa, actualizamos el estado para reflejar el cambio
        if (response.status === 200) {
          setEquipos(equipos.filter((equipo) => equipo.id !== id)); // Refresca la lista
          alert('Equipo eliminado correctamente');
        } else {
          alert('Error al eliminar el equipo');
        }
      } catch (error) {
        console.error('Error al eliminar el equipo:', error);
        alert('Hubo un problema al eliminar el equipo');
      }
    }
  };
  return (
    <div className="container">
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
            {Array.isArray(equipos) && equipos.length > 0 ? (
              equipos.map((equipo) => (
                <tr key={equipo.id}>
                  <td>{equipo.Nombre_Producto}</td>
                  <td>{equipo.Tipo_Equipo}</td>
                  <td>{equipo.Fecha_Adquisicion}</td>
                  <td>{equipo.Ubicacion_Equipo}</td>
                  <td>{equipo.Descripcion_Equipo}</td>
                  <td className="actions">
                    <Link to={`/edit/${equipo.id}`} className="btn btn-warning">Editar</Link>
                    <button onClick={() => deleteEquipo(equipo.id)} className="btn btn-danger">Eliminar</button>
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

      <div className="button-group">
        <Link to="/Main" className="btn btn-return">Regresar</Link>
        <Link to="/create" className="btn btn-create">Crear Nuevo Equipo</Link>
      </div>
    </div>
  );
};

export default MostrarEquipos;
