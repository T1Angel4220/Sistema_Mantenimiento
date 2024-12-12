import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Notification from './Notification'; // Importar el componente Notification
import './MostrarEquipos.css';

const endpoint = 'http://localhost:8000/api/equipos';

const MostrarEquipos = () => {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 13; // Número de elementos por página
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar modal de carga
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [deleteId, setDeleteId] = useState(null); // ID del equipo a eliminar
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar/ocultar modal de confirmación
    const [showEquipoButtons, setShowEquipoButtons] = useState(true); // Estado para mostrar botones debajo del botón "Equipos"

    // Estado para manejar las notificaciones
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        getAllEquipos();
    }, []);

    const getAllEquipos = async () => {
        try {
            const response = await axios.get(endpoint);
            setEquipos(response.data);
        } catch (error) {
            console.error('Error al obtener equipos:', error);
            setNotification({ message: 'Error al obtener los equipos.', type: 'error' });
        }
    };

    const deleteEquipo = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/equipo/${id}`);
            if (response.status === 200) {
                setEquipos(equipos.filter((equipo) => equipo.id !== id));
                setNotification({ message: 'Equipo eliminado correctamente.', type: 'success' });
            } else {
                setNotification({ message: 'Error al eliminar el equipo.', type: 'error' });
            }
        } catch (error) {
            console.error('Error al eliminar el equipo:', error);
            setNotification({ message: 'Hubo un problema al eliminar el equipo.', type: 'error' });
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!file) {
          setNotification({ message: 'Por favor, selecciona un archivo.', type: 'error' });
          return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          const response = await axios.post('http://localhost:8000/api/equipos/import', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
  
          setMessage(response.data.message);
          setNotification({ message: 'Información insertada correctamente.', type: 'success' });
          setShowModal(false); // Cierra el modal
          getAllEquipos(); // Actualiza la tabla después de cargar el archivo
          setFile(null); // Reinicia el archivo seleccionado
      } catch (error) {
          const errorMessage = error.response?.data?.message || 'Error desconocido al cargar el archivo.';
          setMessage(errorMessage);
          setNotification({ message: 'Sube otro archivo válido. El archivo no cumple con el formato requerido.', type: 'error' });
          getAllEquipos(); // Actualiza la tabla después de cargar el archivo
          setFile(null); // Reinicia el archivo seleccionado
      }
  };
  
    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true); // Muestra el modal de confirmación
    };

    const handleDeleteConfirmation = async (confirm) => {
        if (confirm && deleteId !== null) {
            await deleteEquipo(deleteId);
        }
        setDeleteId(null); // Resetea el ID del equipo
        setShowDeleteModal(false); // Cierra el modal de confirmación
    };

    // Paginación
    const totalPages = Math.ceil(equipos.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const displayedEquipos = equipos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleLogout = () => {
        const confirmLogout = window.confirm("¿Está seguro de que desea cerrar sesión?");
        if (confirmLogout) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    return (
        <div className="body-mostrar">
            <div className="main-container">
                {/* Notificación */}
                {notification.message && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification({ message: '', type: '' })}
                    />
                )}

                {/* Sidebar */}
                <div className="main-sidebar">
                    <div className="main-sidebar-header">
                        <h2 className="main-sidebar-title">SK TELECOM</h2>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
                            alt="Logo SK Telecom"
                            className="main-sidebar-logo"
                        />
                    </div>
                    <button
                        className="main-sidebar-btn"
                        onClick={() => {
                            navigate('/Main');
                            setShowEquipoButtons(!showEquipoButtons); // Alternar mostrar/ocultar botones
                        }}
                    >
                        Inicio
                    </button>
                    <button
                        className="main-sidebar-btn"
                        onClick={() => {
                            navigate('/equipos');
                            setShowEquipoButtons(!showEquipoButtons); // Alternar mostrar/ocultar botones
                        }}
                    >
                        Equipos
                    </button>

                    {showEquipoButtons && (
                        <div className="equipo-buttons">
                            <button
                                className="main-sidebar-btn-create"
                                onClick={() => navigate('/create')}
                            >
                                Crear Nuevo Equipo
                            </button>
                            <button
                                className="main-sidebar-btn-upload"
                                onClick={() => setShowModal(true)}
                            >
                                Cargar Equipos
                            </button>
                        </div>
                    )}

                    <button
                        className="main-sidebar-btn"
                        onClick={() => navigate('/mantenimientos')}
                    >
                        Mantenimientos
                    </button>
                    <button
                        className="main-sidebar-btn"
                        onClick={() => navigate('/reportes')}
                    >
                        Reportes
                    </button>
                    <button className="main-logout-btn" onClick={() => navigate('/Main')}>
                        Regresar
                    </button>
                </div>

                {/* Contenido principal */}
                <div className="main-content">
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
                                {displayedEquipos.length > 0 ? (
                                    displayedEquipos.map((equipo) => (
                                        <tr key={equipo.id}>
                                            <td>{equipo.Nombre_Producto}</td>
                                            <td>{equipo.Tipo_Equipo}</td>
                                            <td>{equipo.Fecha_Adquisicion}</td>
                                            <td>{equipo.Ubicacion_Equipo}</td>
                                            <td>{equipo.Descripcion_Equipo}</td>
                                            <td className="actions">
                                                <Link
                                                    to={`/edit/${equipo.id}`}
                                                    className="btn btn-warning"
                                                >
                                                    Editar
                                                </Link>
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

                   {/* Paginación */}
<div className="pagination">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    &lt; Anterior
  </button>
  {totalPages <= 26 ? (
    // Mostrar todas las páginas si hay 26 o menos
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
      {/* Mostrar las primeras 26 páginas */}
      {[...Array(23)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
{/* Botón de puntos suspensivos */}
<div style={{ position: 'relative' }}>
  <button
    onClick={() => {
      const extraPages = document.getElementById('extra-pages');
      extraPages.classList.toggle('hidden'); // Alternar la visibilidad del menú
    }}
  >
    ...
  </button>
  {/* Contenedor para las páginas adicionales */}
  <div id="extra-pages" className="extra-pages-menu hidden">
    {[...Array(totalPages - 23)].map((_, index) => {
      const pageNumber = index + 24; // Calcula el número de página
      return (
        <button
          key={pageNumber}
          onClick={() => {
            handlePageChange(pageNumber);
            document.getElementById('extra-pages').classList.add('hidden'); // Cerrar el menú
          }}
          className={currentPage === pageNumber ? 'active' : ''} // Clase 'active' para la página actual
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

                    {/* Modal de carga */}
                    {showModal && (
                        <div className="modal-mostrar">
                            <div className="modal-content">
                                <h2>Subir Equipos por Lotes</h2>
                                <form onSubmit={handleSubmit} className="upload-form">
                                <div className="upload-field">
    <label htmlFor="file-upload" className="upload-label">Selecciona un archivo:</label>
    <div className="texto-custom-file-upload">
    <button
        type="button"
        className="texto-upload-button"
        onClick={() => document.getElementById('file-upload').click()}
    >
        Seleccionar archivo
    </button>
    <span className="texto-file-name">{file ? file.name : 'Ningún archivo cargado'}</span>
    <input
        id="file-upload"
        type="file"
        accept=".csv, .xlsx"
        onChange={handleFileChange}
        className="texto-hidden-file-input"
    />
</div>
</div>


                                    <button type="submit" className="upload-button">Cargar Archivo</button>
                                </form>
                                <button className="modal-close" onClick={() => setShowModal(false)}>X</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MostrarEquipos;
