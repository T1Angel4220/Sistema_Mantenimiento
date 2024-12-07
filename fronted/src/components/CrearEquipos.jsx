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
    const handleGoBack = () => {
        navigate('/equipos'); 
    };
    const tiposDeEquipos = ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales'];
    const ubicacionesDeEquipo = ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT'];

    const navigate = useNavigate();

    // Manejo de cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos enviados:', formData);


        try {
            console.log('Datos enviados:', formData);  // Ver los datos que se están enviando
            const response = await axios.post(endpoint, formData); // Enviamos todo el objeto formData
            console.log('Respuesta del servidor:', response);  // Ver la respuesta del servidor

            if (response.status === 201) {
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
        <div className="crear-equipos-container">
            <h2>Crear Nuevo Equipo</h2>
            <form onSubmit={handleSubmit}>
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
                        required
                    />
                </div>

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

                <button type="submit" className="submit-btn">Crear Equipo</button>
                <button className="cancel-btn" onClick={handleGoBack}>Regresar</button>

                
            </form>
            
        </div>
    );
};

export default CrearEquipos;
