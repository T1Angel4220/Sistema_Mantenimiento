import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './EditarEquipo.css';


const endpoint = 'http://localhost:8000/api/equipo';

const EditarEquipo = () => {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        Nombre_Producto: '',
        Tipo_Equipo: '',
        Fecha_Adquisicion: '',
        Ubicacion_Equipo: '',
        Descripcion_Equipo: ''
    });

    // Opciones para los campos 'Tipo_Equipo' y 'Ubicacion_Equipo'
    const tiposDeEquipos = ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales'];
    const ubicacionesDeEquipo = ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT'];

    // Obtener el id del equipo de la URL
    const { id } = useParams();
    const navigate = useNavigate();

    // Cargar los datos del equipo cuando el componente se monte
    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await axios.get(`${endpoint}/${id}`);
                setFormData(response.data); // Rellenamos los campos con los datos del equipo
            } catch (error) {
                console.error("Error al cargar el equipo:", error);
            }
        };

        fetchEquipo();
    }, [id]);

    // Manejo de cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Función para enviar el formulario y actualizar el equipo
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${endpoint}/${id}`, formData); // Enviamos los datos actualizados
            navigate('/equipos'); // Redirigir después de actualizar
        } catch (error) {
            console.error('Error al actualizar el equipo:', error);
        }
    };

    return (
        <div className="main-editar-equipo-container">
        <h2 >Editar Equipo</h2>
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

            <div className="main-editar-equipo-buttons">
                <button type="submit" className="main-editar-equipo-btn">Guardar Cambios</button>
                <a href="/equipos" className="main-editar-equipo-btn-regresar">Regresar a la Lista de Equipos</a>
            </div>
        </form>
    </div>
);
};
export default EditarEquipo;
