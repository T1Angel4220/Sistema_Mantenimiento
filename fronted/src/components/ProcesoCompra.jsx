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
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene que se recargue la página al enviar el formulario
    };
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
        }
    };


    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="main-sidebar w-[250px] h-screen">
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
            <div className="flex-1 p-6 bg-gray-200 min-h-screen">
                <div className="w-full max-w-[1000px] mx-auto bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-4xl font-bold text-center text-green-600">Proceso de Compra</h2>
                    <form className="proceso-compra-form space-y-4" onSubmit={handleSubmit}>
                        <div className="">
                            <label htmlFor="name" className="block text-gray-800 font-medium text-xl">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre del proceso de compra"
                                required
                                maxLength="50"
                                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:ring-green-500 focus:border-green-500 text-lg py-3"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="description" className="block text-gray-800 font-medium text-xl">Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describa el proceso de compra"
                                required
                                maxLength="200"
                                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:ring-green-500 focus:border-green-500 text-lg py-3"
                            ></textarea>
                        </div>
                        <div className="">
                            <label htmlFor="date" className="block text-gray-800 font-medium text-xl">Fecha</label>
                            <input
                                min={new Date().toISOString().split('T')[0]}
                                type="date"
                                id="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:ring-green-500 focus:border-green-500 text-lg py-3"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="provider" className="block text-gray-800 font-medium text-xl">Proveedor</label>
                            <div className="flex flex-col">
                                <select
                                    id="provider"
                                    name="provider"
                                    value={form.provider}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:ring-green-500 focus:border-green-500 text-lg"
                                >
                                    <option value="">Seleccione un proveedor</option>
                                    <option value="Amazon">Amazon</option>
                                    <option value="eBay">eBay</option>
                                    <option value="Alibaba">Alibaba</option>
                                    <option value="MercadoLibre">MercadoLibre</option>
                                    <option value="Shopify">Shopify</option>
                                    <option value="Otro">Otro</option>
                                </select>

                                {/* Campo para escribir otro proveedor si se selecciona "Otro" */}
                                {form.provider === 'Otro' && (
                                    <input
                                        type="text"
                                        id="providerOther"
                                        name="providerOther"
                                        value={form.providerOther || ''}
                                        onChange={handleChange}
                                        placeholder="Escriba el nombre del proveedor"
                                        className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:ring-green-500 focus:border-green-500 text-lg py-3"
                                        />
                                )}
                            </div>
                        </div>

                        <div className=" flex justify-center space-x-4  ml-90">
                            <button
                                type="submit"
                                className="proceso-compra-save bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                                onClick={handleSave}
                            >
                                Guardar
                            </button>
                            <button
                                type="reset"
                                className=" bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                                onClick={() => setForm({ name: '', description: '', date: '', provider: '' })}
                            >
                                Limpiar Campos
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de registros */}
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-xl font-semibold">ID</th>
                                <th className="px-6 py-3 text-xl font-semibold">Nombre</th>
                                <th className="px-6 py-3 text-xl font-semibold">Descripción</th>
                                <th className="px-6 py-3 text-xl font-semibold">Fecha</th>
                                <th className="px-6 py-3 text-xl font-semibold">Proveedor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase, index) => (
                                <tr
                                    key={purchase.id}
                                    className={`hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}
                                >
                                    <td className="px-6 py-4 border-t text-lg">{purchase.id}</td>
                                    <td className="px-6 py-4 border-t text-lg">{purchase.nombre}</td>
                                    <td className="px-6 py-4 border-t text-lg">{purchase.descripcion}</td>
                                    <td className="px-6 py-4 border-t text-lg">{purchase.fecha}</td>
                                    <td className="px-6 py-4 border-t text-lg">{purchase.proveedor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    );
};

export default ProcesoCompra;
