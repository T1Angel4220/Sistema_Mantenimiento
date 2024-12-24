// Archivo: ProcesoCompra.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importar Axios
import './ProcesoCompra.css';

const ProcesoCompra = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        description: '',
        date: '',
        provider: ''
    });
    const [purchases, setPurchases] = useState([]);

    // Obtener datos de la base de datos al cargar el componente
    useEffect(() => {
        axios.get('http://localhost:8000/api/proceso-compra') // Ruta de la API Laravel
            .then(response => setPurchases(response.data))
            .catch(error => console.error('Error al obtener los datos:', error));
    }, []);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Guardar datos en la base de datos
    const handleSave = () => {
        if (form.name && form.description && form.date && form.provider) {
            axios.post('http://localhost:8000/api/proceso-compra', form)
                .then(response => {
                    setPurchases([...purchases, response.data]);
                    alert('Proceso de compra creado correctamente');
                    setForm({ name: '', description: '', date: '', provider: '' });
                })
                .catch(error => {
                    console.error('Error completo:', error.response);
                    alert(`Error: ${error.response?.data?.message || 'Ocurrió un error inesperado.'}`);
                });
        } else {
            alert('Por favor, complete todos los campos antes de guardar.');
        }
    };
    

    return (
        <div className="proceso-compra-container">
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
                <button className="main-sidebar-btn" onClick={() => navigate('/Main')}>Inicio</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/ProcesoCompra')}>Proceso de Compra</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/equipos')}>Activos</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/InicioMantenimientos')}>Mantenimientos</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/reportes')}>Reportes</button>
                <button className="main-logout-btn" onClick={() => navigate('/Main')}>Regresar</button>
            </div>

            {/* Contenido Principal */}
            <div className="proceso-compra-content">
                <div className="proceso-compra-form-container">
                    <h2 className="proceso-compra-title">Proceso de Compra</h2>
                    <form className="proceso-compra-form">
                        <div className="proceso-compra-form-group">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Ingrese el nombre del proceso de compra" required />
                        </div>
                        <div className="proceso-compra-form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Describa el proceso de compra" required />
                        </div>
                        <div className="proceso-compra-form-group">
                            <label htmlFor="date">Fecha</label>
                            <input type="date" id="date" name="date" value={form.date} onChange={handleChange} required />
                        </div>
                        <div className="proceso-compra-form-group">
                            <label htmlFor="provider">Proveedor</label>
                            <input type="text" id="provider" name="provider" value={form.provider} onChange={handleChange} placeholder="Ingrese el nombre del proveedor" required />
                        </div>
                        <div className="proceso-compra-button-group">
                            <button type="button" className="proceso-compra-save" onClick={handleSave}>Guardar</button>
                            <button type="reset" className="proceso-compra-delete" onClick={() => setForm({ name: '', description: '', date: '', provider: '' })}>Borrar</button>
                        </div>
                    </form>
                </div>

                {/* Tabla de registros */}
                <table className="proceso-compra-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase) => (
                            <tr key={purchase.id}>
                                <td>{purchase.id}</td>
                                <td>{purchase.nombre}</td>
                                <td>{purchase.descripcion}</td>
                                <td>{purchase.fecha}</td>
                                <td>{purchase.proveedor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcesoCompra;
