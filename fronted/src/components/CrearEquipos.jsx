import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import './CrearEquipos.css';

const endpoint = 'http://localhost:8000/api';

const CrearEquipos = () => {
    const [formData, setFormData] = useState({
        Nombre_Producto: '',
        Codigo_Barras: '',
        Tipo_Equipo: '',
        Fecha_Adquisicion: '',
        Ubicacion_Equipo: '',
        Descripcion_Equipo: '',
        proceso_compra_id: '' // This will store the PRC-XXX format ID
    });

    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [procesosCompra, setProcesosCompra] = useState([]);
    const navigate = useNavigate();

    const tiposDeEquipos = ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales'];
    const ubicacionesDeEquipo = ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT'];

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const handlePopState = () => {
            navigate('/equipos', { replace: true });
        };

        window.history.replaceState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        // Updated fetch function to handle errors properly
        const fetchProcesosCompra = async () => {
            try {
                const response = await axios.get(`${endpoint}/procesos-compra`);
                if (response.data) {
                    setProcesosCompra(response.data);
                }
            } catch (error) {
                console.error('Error al cargar procesos de compra:', error);
                setNotification({
                    message: 'Error al cargar procesos de compra. Por favor, intente nuevamente.',
                    type: 'error'
                });
            }
        };

        fetchProcesosCompra();

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

        setError('');

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
            // Ensure proceso_compra_id is included in the request
            const response = await axios.post(`${endpoint}/equipo`, {
                ...formData,
                proceso_compra_id: formData.proceso_compra_id // Make sure this is included
            });
            
            if (response.status === 201) {
                setNotification({
                    message: 'Equipo creado correctamente.',
                    type: 'success'
                });
                setTimeout(() => navigate('/equipos', { replace: true }), 2000);
            }
        } catch (error) {
            console.error('Error al crear el equipo:', error);
            setNotification({
                message: error.response?.data?.message || 'Error al crear el equipo. Por favor, intente nuevamente.',
                type: 'error'
            });
        }
    };

    return (
        <div className="crear-equipos-body">
            <div className="crear-equipos-container">
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
                        <label htmlFor="Codigo_Barras" className="crear-equipos-label">Código de Barras</label>
                        <input
                            type="text"
                            id="Codigo_Barras"
                            name="Codigo_Barras"
                            className="crear-equipos-input"
                            value={formData.Codigo_Barras}
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
                    {error && <p className="crear-equipos-error">{error}</p>}

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

                    {/* Updated Proceso de Compra field */}
                    <div className="crear-equipos-form-group">
                        <label htmlFor="proceso_compra_id" className="crear-equipos-label">
                            Proceso de Compra
                        </label>
                        <select
                            id="proceso_compra_id"
                            name="proceso_compra_id"
                            className="crear-equipos-select"
                            value={formData.proceso_compra_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un proceso de compra</option>
                            {procesosCompra.map((proceso) => (
                                <option key={proceso.id} value={proceso.id}>
                                    {`${proceso.id} - ${proceso.nombre}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="crear-equipos-submit-btn" disabled={!!error}>Crear Equipo</button>
                    <button type="button" className="crear-equipos-cancel-btn" onClick={() => navigate('/equipos')}>Regresar</button>
                </form>
            </div>
        </div>
    );
};

export default CrearEquipos;

