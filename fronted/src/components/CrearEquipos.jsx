import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification'; // Importar el componente Notification
import './CrearEquipos.css';

const endpoint = 'http://localhost:8000/api/equipo';

const CrearEquipos = () => {
    const [formData, setFormData] = useState({
        Nombre_Producto: '',
        Tipo_Equipo: '',
        Fecha_Adquisicion: '',
        Ubicacion_Equipo: '',
        Descripcion_Equipo: ''
    });

    const [error, setError] = useState(''); // Estado para manejar mensajes de error
    const [notification, setNotification] = useState({ message: '', type: '' }); // Estado para manejar notificaciones
    const navigate = useNavigate();

    const tiposDeEquipos = ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales'];
    const ubicacionesDeEquipo = ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT'];

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const handlePopState = () => {
            navigate('/equipos', { replace: true });
        };

        // Reemplazar la entrada actual en el historial
        window.history.replaceState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

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
            const response = await axios.post(endpoint, formData);
            if (response.status === 201) {
                setNotification({ message: 'Equipo creado correctamente.', type: 'success' }); // Mostrar notificación
                setTimeout(() => navigate('/equipos', { replace: true }), 2000); // Redirigir después de 2 segundos
            } else {
                setNotification({ message: 'Error al crear el equipo.', type: 'error' }); // Mostrar error
            }
        } catch (error) {
            console.error('Error al crear el equipo:', error);
            setNotification({ message: 'Hubo un error al crear el equipo. Intenta nuevamente.', type: 'error' });
        }
    };

    return (
        <div className="crear-equipos-body">
            <div className="crear-equipos-container">
                {/* Notificación */}
                {notification.message && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification({ message: '', type: '' })}
                    />
                )}

                <h2 className="crear-equipos-title">Crear Nuevo Equipo</h2>
                <form className="crear-equipos-form" onSubmit={handleSubmit}>
                    <div className="crear-equipos-form-group">
                        <label htmlFor="Nombre_Producto" className="crear-equipos-label">Nombre del Producto</label>
                        <input
                            type="text"
                            id="Nombre_Producto"
                            name="Nombre_Producto"
                            className="crear-equipos-input"
                            value={formData.Nombre_Producto}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="crear-equipos-form-group">
                        <label htmlFor="Tipo_Equipo" className="crear-equipos-label">Tipo de Equipo</label>
                        <select
                            id="Tipo_Equipo"
                            name="Tipo_Equipo"
                            className="crear-equipos-select"
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

                    <div className="crear-equipos-form-group">
                        <label htmlFor="Fecha_Adquisicion" className="crear-equipos-label">Fecha de Adquisición</label>
                        <input
                            type="date"
                            id="Fecha_Adquisicion"
                            name="Fecha_Adquisicion"
                            className="crear-equipos-input"
                            value={formData.Fecha_Adquisicion}
                            onChange={handleChange}
                            max={today}
                            required
                        />
                    </div>
                    {error && <p className="crear-equipos-error">{error}</p>} {/* Mostrar mensaje de error */}

                    <div className="crear-equipos-form-group">
                        <label htmlFor="Ubicacion_Equipo" className="crear-equipos-label">Ubicación del Equipo</label>
                        <select
                            id="Ubicacion_Equipo"
                            name="Ubicacion_Equipo"
                            className="crear-equipos-select"
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

                    <div className="crear-equipos-form-group">
                        <label htmlFor="Descripcion_Equipo" className="crear-equipos-label">Descripción del Equipo</label>
                        <textarea
                            id="Descripcion_Equipo"
                            name="Descripcion_Equipo"
                            className="crear-equipos-textarea"
                            value={formData.Descripcion_Equipo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="crear-equipos-submit-btn" disabled={!!error}>Crear Equipo</button>
                    <button type="button" className="crear-equipos-cancel-btn" onClick={() => navigate('/equipos')}>Regresar</button>
                </form>
            </div>
        </div>
    );
};

export default CrearEquipos;
