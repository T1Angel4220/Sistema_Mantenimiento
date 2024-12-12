import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Notification from "./Notification"; // Importar el componente Notification
import './EditarEquipo.css';

const endpoint = 'http://localhost:8000/api/equipo';

const EditarEquipo = () => {
    const [formData, setFormData] = useState({
        Nombre_Producto: '',
        Tipo_Equipo: '',
        Fecha_Adquisicion: '',
        Ubicacion_Equipo: '',
        Descripcion_Equipo: ''
    });

    const [error, setError] = useState(''); // Estado para manejar mensajes de error
    const [notification, setNotification] = useState({ message: '', type: '' }); // Estado para manejar notificaciones
    const tiposDeEquipos = ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales'];
    const ubicacionesDeEquipo = ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT'];

    const { id } = useParams();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await axios.get(`${endpoint}/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Error al cargar el equipo:", error);
                setNotification({ message: "Error al cargar el equipo.", type: "error" });
            }
        };

        fetchEquipo();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'Fecha_Adquisicion' && value > today) {
            setError('La fecha de adquisición no puede ser mayor al día actual.');
            return;
        }

        setError(''); // Limpiar el mensaje de error si todo es válido

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.Fecha_Adquisicion > today) {
            setError('La fecha de adquisición no puede ser mayor al día actual.');
            return;
        }

        try {
            await axios.put(`${endpoint}/${id}`, formData);
            setNotification({ message: "Equipo actualizado correctamente.", type: "success" });
            setTimeout(() => navigate('/equipos'), 2000); // Redirigir después de 3 segundos
        } catch (error) {
            console.error('Error al actualizar el equipo:', error);
            setNotification({ message: "Hubo un error al actualizar el equipo. Intenta nuevamente.", type: "error" });
        }
    };

    return (
        <div className="main-editar-equipos-body">
            {/* Notificación fuera del contenedor */}
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: '', type: '' })}
                />
            )}

            <div className="main-editar-equipo-container">
                <h2>Editar Equipo</h2>
                <form className="main-editar-equipo-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Nombre_Producto">Nombre del Producto</label>
                        <input
                            type="text"
                            id="Nombre_Producto"
                            name="Nombre_Producto"
                            value={formData.Nombre_Producto}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="Tipo_Equipo">Tipo de Equipo</label>
                        <select
                            id="Tipo_Equipo"
                            name="Tipo_Equipo"
                            value={formData.Tipo_Equipo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un tipo</option>
                            {tiposDeEquipos.map((tipo, index) => (
                                <option key={index} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="Fecha_Adquisicion">Fecha de Adquisición</label>
                        <input
                            type="date"
                            id="Fecha_Adquisicion"
                            name="Fecha_Adquisicion"
                            value={formData.Fecha_Adquisicion}
                            onChange={handleChange}
                            max={today}
                            required
                        />
                    </div>
                    {error && <p className="editar-equipo-error">{error}</p>} {/* Mostrar mensaje de error */}

                    <div className="form-group">
                        <label htmlFor="Ubicacion_Equipo">Ubicación del Equipo</label>
                        <select
                            id="Ubicacion_Equipo"
                            name="Ubicacion_Equipo"
                            value={formData.Ubicacion_Equipo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una ubicación</option>
                            {ubicacionesDeEquipo.map((ubicacion, index) => (
                                <option key={index} value={ubicacion}>
                                    {ubicacion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="Descripcion_Equipo">Descripción del Equipo</label>
                        <textarea
                            id="Descripcion_Equipo"
                            name="Descripcion_Equipo"
                            value={formData.Descripcion_Equipo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="main-editar-equipo-buttons">
                        <a href="/equipos" className="main-editar-equipo-btn-regresar">Regresar a la Lista de Equipos</a>
                        <button type="submit" className="main-editar-equipo-btn" disabled={!!error}>
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarEquipo;
