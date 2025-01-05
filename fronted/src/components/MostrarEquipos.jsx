import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, Box, PenTool, FileText, LogOut } from 'lucide-react';
import Notification from './Notification';
import './MostrarEquipos.css';

const endpoint = 'http://localhost:8000/api/equipos';

const MostrarEquipos = () => {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 13;
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEquipoButtons, setShowEquipoButtons] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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
            setNotification({ message: response.data.message, type: 'success' });
            setShowModal(false);
            getAllEquipos();
            setFile(null);
        } catch (error) {
            if (error.response?.status === 422) {
                const duplicatedCodes = error.response?.data?.duplicated_codes || [];
                const errorMessage = `${error.response?.data?.message} Códigos duplicados: ${duplicatedCodes.join(', ')}`;
                setNotification({ message: errorMessage, type: 'warning' });
            } else {
                const errorMessage = error.response?.data?.message || 'Error desconocido al cargar el archivo.';
                setNotification({ message: errorMessage, type: 'error' });
            }

            getAllEquipos();
            setFile(null);
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmation = async (confirm) => {
        if (confirm && deleteId !== null) {
            await deleteEquipo(deleteId);
        }
        setDeleteId(null);
        setShowDeleteModal(false);
    };

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
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const navItems = [
        { icon: Home, label: 'Inicio', route: '/Main' },
        { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
        { icon: Box, label: 'Activos', route: '/equipos' },
        { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
        { icon: FileText, label: 'Reportes', route: '/reportes' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: '', type: '' })}
                />
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-[#1a374d] text-white flex flex-col h-screen sticky top-0">
                <div className="p-6 space-y-2">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
                        alt="Logo SK Telecom"
                        className="h-12 w-auto"
                    />
                </div>
                <nav className="space-y-1 px-3 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.route}
                                className="w-full flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                                onClick={() => navigate(item.route)}
                            >
                                <Icon className="mr-2 h-5 w-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
        <div className="p-4 mt-auto">
          <button 
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => navigate('/Main')}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Regresar
          </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
                            Registro de Activos
                        </h1>
                        <p className="text-center text-gray-600 mb-6">
                            Ingrese los detalles del nuevo activo
                        </p>
                        
                        <div className="flex justify-center gap-4 pt-4">
                            <button
                                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-semibold text-sm uppercase tracking-wider shadow-sm"
                                onClick={() => navigate('/create')}
                            >
                                Crear Nuevo Activo
                            </button>
                            <button
                                className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold text-sm uppercase tracking-wider shadow-sm"
                                onClick={() => setShowModal(true)}
                            >
                                Cargar Activos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="max-w-8xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre del Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tipo de Equipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha de Adquisición</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ubicación del Equipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Descripción del Equipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {displayedEquipos.map((equipo) => (
                                    <tr key={equipo.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Nombre_Producto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Tipo_Equipo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Fecha_Adquisicion}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Ubicacion_Equipo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Descripcion_Equipo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/edit/${equipo.id}`} className="text-red-600 hover:text-blue-900 mr-2 bg-blue-100 px-2 py-1 rounded">Editar</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="pagination mt-4 flex justify-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-l-md"
                    >
                        &lt; Anterior
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-r-md"
                    >
                        Siguiente &gt;
                    </button>
                </div>

                {/* Modal for file upload */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Subir Activos por Lotes</h3>
                                <form onSubmit={handleSubmit} className="mt-4 mb-4">
                                    <div className="mb-4">
                                        <input 
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Seleccionar archivo
                                        </label>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {file ? file.name : 'Ningún archivo seleccionado'}
                                        </p>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="w-full px-4 py-2 bg-green-500 text-white text-sm font-semibold uppercase tracking-wider rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cargar Archivo
                                    </button>
                                </form>
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="mt-3 w-full px-4 py-2 bg-red-500 text-white text-sm font-semibold uppercase tracking-wider rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logout confirmation modal */}
                {showLogoutModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="logout-modal">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">¿Está seguro de que desea cerrar sesión?</h3>
                            <div className="flex justify-center space-x-4">
                                <button onClick={confirmLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                    Sí
                                </button>
                                <button onClick={cancelLogout} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors">
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MostrarEquipos;

