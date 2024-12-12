import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MostrarEquipos.css';

const endpoint = 'http://localhost:8000/api/equipos';

const MostrarEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar modal de carga
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [deleteId, setDeleteId] = useState(null); // ID del equipo a eliminar
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar/ocultar modal de confirmación

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

    const deleteEquipo = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/equipo/${id}`);
            if (response.status === 200) {
                setEquipos(equipos.filter((equipo) => equipo.id !== id));
                alert('Equipo eliminado correctamente');
            } else {
                alert('Error al eliminar el equipo');
            }
        } catch (error) {
            console.error('Error al eliminar el equipo:', error);
            alert('Hubo un problema al eliminar el equipo');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/api/equipos/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            alert('Datos insertados correctamente.');
            setShowModal(false); // Cierra el modal
            getAllEquipos(); // Actualiza la tabla
            getAllEquipos(); // Actualiza la tabla después de cargar el archivo
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setMessage(`Error: ${error.response.data.message}`);
            } else {
                console.error('Unknown error:', error);
                setMessage('Error desconocido al cargar el archivo.');
            }
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

    return (
        <div className="body-mostrar">
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
                    <button onClick={() => setShowModal(true)} className="btn btn-upload">Cargar Equipos</button>
                </div>
              
              {showModal && (
                    <div className="modal-mostrar">
                        <div className="modal-content">
                            <h2>Subir Equipos por Lotes</h2>
                            <form onSubmit={handleSubmit} className="upload-form">
                                <div className="upload-field">
                                    <label htmlFor="file-upload" className="upload-label">Selecciona un archivo:</label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".csv, .xlsx"
                                        onChange={handleFileChange}
                                        className="upload-input"
                                    />
                                </div>
                                <button type="submit" className="upload-button">Cargar Archivo</button>
                            </form>
                            <button className="modal-close" onClick={() => setShowModal(false)}>Cerrar</button>
                            {message && <p className={`upload-message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal-mostrar">
                        <div className="modal-content">
                            <h2>Confirmación</h2>
                            <p>¿Estás seguro de que deseas eliminar este equipo?</p>
                            <div className="button-group">
                                <button onClick={() => handleDeleteConfirmation(true)} className="btn btn-danger">Sí</button>
                                <button onClick={() => handleDeleteConfirmation(false)} className="btn btn-secondary">No</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MostrarEquipos;
