import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const tiposDeEquipos = ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales'];
    const ubicacionesDeEquipo = ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT'];

    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Manejo de cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validar fecha
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

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.Fecha_Adquisicion > today) {
            setError('La fecha de adquisición no puede ser mayor al día actual.');
            return;
        }

        try {
            const response = await axios.post(endpoint, formData);
            if (response.status === 201) {
                alert('Equipo creado correctamente');
                navigate('/equipos'); // Redirigir después de la creación si la respuesta es exitosa
            } else {
                alert('Error al crear el equipo');
            }
        } catch (error) {
            console.error('Error al crear el equipo:', error);
            alert('Hubo un error al crear el equipo. Intenta nuevamente.');
        }
    };

    return (
        <div className="crear-equipos-body">
            <div className="crear-equipos-container">
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
                            max={today} // Restringe fechas mayores al día actual visualmente
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
