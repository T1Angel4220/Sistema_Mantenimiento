import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importamos axios para las solicitudes HTTP
import './main.css';

const Main = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]); // Estado para almacenar todos los equipos
  const [ultimoEquipo, setUltimoEquipo] = useState(null); // Estado para el último equipo

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, redirige al login
      navigate('/'); // Redirige al login
    } else {
      // Obtener todos los equipos y el último equipo
      getEquipos();
    }
  }, [navigate]);

  const getEquipos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/equipos'); // Endpoint para obtener todos los equipos
      const equipos = response.data;

      setEquipos(equipos); // Guardamos todos los equipos en el estado

      // Ordenamos los equipos por fecha de adquisición y tomamos el último
      const ultimo = equipos.sort((a, b) => new Date(b.Fecha_Adquisicion) - new Date(a.Fecha_Adquisicion))[0];
      setUltimoEquipo(ultimo); // Guardamos el último equipo en el estado
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
    }
  };

  const handleLogout = () => {
    // Muestra el mensaje de confirmación
    const confirmLogout = window.confirm("¿Está seguro de que desea cerrar sesión?");
    if (confirmLogout) {
      // Si confirma, elimina el token y redirige al login
      localStorage.removeItem('token');
      navigate('/'); // Redirige al login
    }
  };

  return (
    <div className="main-container">
      <div className="main-sidebar">
        <div className="main-sidebar-header">
          <h2 className="main-sidebar-title">T1</h2>
        </div>
        <button className="main-sidebar-btn" onClick={() => navigate('/equipos')}>Equipos</button>
        <button className="main-sidebar-btn" onClick={() => navigate('/mantenimientos')}>Mantenimientos</button>
        <button className="main-sidebar-btn" onClick={() => navigate('/reportes')}>Reportes</button>
        <button className="main-logout-btn" onClick={handleLogout}>Salir</button>
      </div>

      <div className="main-content">
        <div className="main-header">
          <h1 className="main-header-title">Bienvenido al Sistema</h1>
        </div>

        {/* Sección de "Últimos Registros" */}
        <div className="main-cards">
          <div className="main-card">
            <h2 className="main-card-title">Últimos Registros</h2>
            <p className="main-card-text">
              <strong>{ultimoEquipo ? ultimoEquipo.Nombre_Producto : "Cargando..."}</strong>
              <br />
              <span>{ultimoEquipo ? ultimoEquipo.Fecha_Adquisicion : "Cargando..."}</span>
            </p>
          </div>
        </div>

        {/* Sección de la tabla con todos los equipos */}
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
              {equipos.length > 0 ? (
                equipos.map((equipo) => (
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
                  <td colSpan="5" className="main-td">Cargando equipos...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Main;
