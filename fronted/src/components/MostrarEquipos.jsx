import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Box } from 'lucide-react';
import { PenTool } from 'lucide-react';
import { FileText } from 'lucide-react';
import { LogOut } from 'lucide-react';
import axios from 'axios';
import Notification from './Notification';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Barcode } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TimelineView from "./ui/TimelineView";
import PaginationControls from "./ui/PaginationControls";
import { Calendar } from 'lucide-react';
import { Building2 } from 'lucide-react';

import CardComponents from "@/components/ui/card";
const { Card, CardContent, CardHeader, CardTitle } = CardComponents;

import Badge from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    PenTool as Tool,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Modal } from '@mui/material';

import './MostrarEquipos.css';

const endpoint = `http://localhost:8000/api/equipos`;


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
    const [historialData, setHistorialData] = useState({
        mantenimientos: [],
        actividades: [],
        componentes: [],
        equipos: [],
    }); const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [historialModalOpen, setHistorialModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
    const [compSearchTerm, setCompSearchTerm] = useState(""); // Para el filtro de componentes
    const [currentCompPage, setCurrentCompPage] = useState(1); // Para la paginación de componentes
    const [activeTab, setActiveTab] = useState("componentes"); // Estado para el tab activo


    const filteredEquipos = equipos.filter((equipo) =>
        equipo.Nombre_Producto.toLowerCase().includes(searchTerm.toLowerCase())
    );



    useEffect(() => {
        // Cargar la lista de equipos
        const fetchEquipos = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/equipos`);
                setEquipos(response.data);
            } catch (error) {
                console.error('Error al cargar los equipos:', error);
            }
        };

        fetchEquipos();
    }, []);

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

    const fetchHistorialData = async (equipoId) => {
        try {
            // Obtener el historial de mantenimientos asociados al equipo
            const mantenimientosResponse = await axios.get(
                `http://localhost:8000/api/historial-equipo/${equipoId}`
            );

            // Procesar cada mantenimiento para incluir detalles, componentes y actividades
            const mantenimientosConComponentesYActividades = await Promise.all(
                mantenimientosResponse.data.map(async (mantenimiento) => {
                    try {
                        // Obtener detalles del mantenimiento
                        const detallesResponse = await axios.get(
                            `http://localhost:8000/api/mantenimientoDetalles/${mantenimiento.id}`
                        );

                        // Buscar componentes relacionados con el equipo
                        const componentes = detallesResponse.data.equipos
                            .find((e) => e.id === equipoId)?.componentes || [];

                        const componentesConNombre = componentes.map((componente) => ({
                            ...componente,
                            componente_nombre:
                                componente.nombre || componente.componente_nombre || "Nombre no disponible",
                        }));

                        // Obtener actividades asociadas al mantenimiento y equipo
                        const actividadesResponse = await axios.get(
                            `http://localhost:8000/api/mantenimiento-actividad/${mantenimiento.id}/${equipoId}`
                        );

                        // Mapear `fecha_inicio` a `fechaInicio`
                        return {
                            ...mantenimiento,
                            fechaInicio: mantenimiento.fecha_inicio,
                            componentes: componentesConNombre,
                            actividades: actividadesResponse.data, // Incluir actividades
                        };
                    } catch (detallesError) {
                        console.error(
                            `Error al obtener detalles para mantenimiento ${mantenimiento.id}:`,
                            detallesError
                        );
                        return { ...mantenimiento, componentes: [], actividades: [] }; // Devuelve sin detalles ni actividades en caso de error
                    }
                })
            );

            // Actualizar el estado con los datos procesados (mantenimientos, componentes y actividades)
            setHistorialData({
                mantenimientos: mantenimientosConComponentesYActividades,
                actividades: [], // No es necesario aquí, porque ya se están incluyendo con cada mantenimiento
                componentes: [],
                equipos: [],
            });
        } catch (error) {
            console.error("Error al obtener el historial del equipo:", error);
        }
    };


    const handleSelectMantenimiento = (codigo) => {
        console.log("Código seleccionado:", codigo);
        const mantenimiento = historialData.mantenimientos.find(
            (m) => m.codigo_mantenimiento === codigo
        );
        console.log("Mantenimiento seleccionado:", mantenimiento);
        setSelectedMantenimiento(mantenimiento || null);
    };


    const handleTabChange = (value) => {
        console.log("Tab cambiado a:", value);
        setActiveTab(value); // Actualiza el estado del tab activo
    };

    const openHistorialModal = (equipo) => {
        setSelectedEquipo(equipo);
        fetchHistorialData(equipo.id);
        setHistorialModalOpen(true);
    };

    const closeHistorialModal = () => {
        setSelectedEquipo(null);
        setHistorialModalOpen(false);
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
            const response = await axios.post(`http://localhost:8000/api/equipos/import`, formData, {
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
                const errors = error.response?.data?.errors || {};
                const duplicatedCodes = errors.duplicated_codes || [];
                const invalidProcesses = errors.invalid_processes || [];

                let warningMessage = error.response?.data?.message;

                // Agregar detalles específicos si existen
                if (duplicatedCodes.length > 0) {
                    warningMessage += 'Equipos insertados con éxito, excepto los códigos duplicados.';
                }

                if (invalidProcesses.length > 0) {
                    warningMessage += 'Equipos insertados con éxito, excepto aquellos con Proceso de Compra inválidos';
                }

                setNotification({ message: warningMessage, type: 'warning' });
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
            <aside
                className="flex flex-col h-screen sticky top-0 bg-[#1a374d] text-white"
                style={{
                    width: "256px", // Ancho fijo
                    minWidth: "256px", // Ancho mínimo fijo
                    maxWidth: "256px", // Ancho máximo fijo
                    flexShrink: 0, // Evita que se reduzca
                }}
            >                <div className="p-6 space-y-2">
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
                    <div className="table-container">
                        <table className="tableEquipos">
                            <thead className="bg-[#2f3b52]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Código de Barras</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre del Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tipo de Equipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha de Adquisición</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ubicación del Equipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Descripción del Equipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Proceso de Compra</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {displayedEquipos.map((equipo) => (
                                    <tr key={equipo.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Codigo_Barras}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Nombre_Producto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Tipo_Equipo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Fecha_Adquisicion}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Ubicacion_Equipo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.Descripcion_Equipo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.proceso_compra_id || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => openHistorialModal(equipo)}
                                            >
                                                Ver Historial
                                            </Button>
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
                    {selectedEquipo && (
                        <Modal open={historialModalOpen} onClose={closeHistorialModal}>
                            <div className="modal-historial">
                                <Card className="modal-card">
                                    {/* Header del modal */}
                                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                                        <div className="modal-header">
                                            <div className="info-row">
                                                <Box className="w-5 h-5" />
                                                <span>Historial del Equipo</span>
                                            </div>
                                            {selectedEquipo && (
                                                <>
                                                    <div className="info-row">
                                                        <Barcode className="w-4 h-4" />
                                                        <span>Código de Barras: {selectedEquipo.Codigo_Barras}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Tool className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Nombre: {selectedEquipo.Nombre_Producto}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </CardHeader>

                                    {/* Contenido del modal */}
                                    <CardContent className="p-6">
                                        {historialData?.mantenimientos && historialData.mantenimientos.length > 0 ? (
                                            <div className="flex gap-6">
                                                {/* Panel izquierdo: Lista de mantenimientos */}
                                                <div className="w-1/3">
                                                    <div className="mb-4">
                                                        <div className="input-container">
                                                            <Search className="icon" />
                                                            <Input
                                                                type="text"
                                                                placeholder="Buscar mantenimiento..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="w-full border border-gray-300 rounded-md"
                                                                icon={<Search className="timeline-item-icon" />} // Ícono personalizado
                                                            />
                                                        </div>
                                                    </div>
                                                    <ScrollArea className="h-[600px]">

                                                        <TimelineView

                                                            mantenimientos={historialData.mantenimientos}
                                                            onSelectMant={handleSelectMantenimiento}
                                                            currentPage={currentPage}
                                                            itemsPerPage={itemsPerPage}
                                                        />
                                                    </ScrollArea>
                                                    <PaginationControls
                                                        currentPage={currentPage}
                                                        totalPages={Math.ceil(historialData.mantenimientos.length / itemsPerPage)}
                                                        onPageChange={setCurrentPage}
                                                    />
                                                </div>

                                                {/* Panel derecho: Detalles del mantenimiento seleccionado */}
                                                <div className="w-2/3">
                                                    {selectedMantenimiento && (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="space-y-1">
                                                                    <h3 className="text-lg font-semibold">{selectedMantenimiento.codigo_mantenimiento}</h3>
                                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                        <div className="flex items-center gap-1">
                                                                            <Calendar className="w-4 h-4" />
                                                                            <span>{selectedMantenimiento?.fechaInicio || "Fecha no disponible"}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <Building2 className="w-4 h-4" />
                                                                            {selectedMantenimiento?.proveedor || "Proveedor no disponible"}
                                                                        </div>
                                                                        <div
                                                                            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${selectedMantenimiento.estado === "No terminado"
                                                                                    ? "bg-red-500 text-white"
                                                                                    : "bg-gray-800 text-white"
                                                                                }`}
                                                                        >
                                                                            {selectedMantenimiento.estado}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Tabs para actividades y componentes */}
                                                            <Tabs
                                                                defaultValue="componentes"
                                                                className="w-full"
                                                            >
                                                                <TabsList className="tabs-content">
                                                                    <TabsTrigger value="componentes">
                                                                        Componentes ({selectedMantenimiento?.componentes?.length || 0})
                                                                    </TabsTrigger>
                                                                    <TabsTrigger value="actividades">
                                                                        Actividades ({selectedMantenimiento?.actividades?.length || 0})
                                                                    </TabsTrigger>
                                                                </TabsList>
                                                                <TabsContent value="componentes" className="tabs-content">
                                                                    <div className="mb-4">
                                                                        <div className="input-container">
                                                                            <Search className="icon" />
                                                                            <Input
                                                                                type="text"
                                                                                placeholder="Buscar componente..."
                                                                                value={compSearchTerm}
                                                                                onChange={(e) => setCompSearchTerm(e.target.value)}
                                                                                className="w-full"
                                                                                icon={<Search className="w-4 h-4" />}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <ScrollArea className="h-[400px]">
                                                                        {selectedMantenimiento?.componentes && selectedMantenimiento.componentes.length > 0 ? (
                                                                            <ul>
                                                                                {selectedMantenimiento.componentes.map((componente, index) => (
                                                                                    <li key={index} className="mb-4">
                                                                                        <div className="font-semibold text-gray-900">{componente.componente_nombre}</div>
                                                                                        <div className="text-sm text-gray-600">{componente.descripcion || "Descripción no disponible"}</div>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <p>No hay componentes asociados</p>
                                                                        )}
                                                                    </ScrollArea>
                                                                </TabsContent>


                                                                {/* Contenido del tab Actividades */}
                                                                <TabsContent value="actividades" className="tabs-content">
                                                                    <div className="mb-4">
                                                                        <div className="input-container">
                                                                            <Search className="icon" />
                                                                            <Input
                                                                                type="text"
                                                                                placeholder="Buscar actividad..."
                                                                                value={compSearchTerm} // Puedes cambiar a un estado específico para actividades
                                                                                onChange={(e) => setCompSearchTerm(e.target.value)} // Cambia el manejador si es necesario
                                                                                className="w-full"
                                                                                icon={<Search className="w-4 h-4" />}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <ScrollArea className="h-[400px]">
                                                                        {selectedMantenimiento?.actividades && selectedMantenimiento.actividades.length > 0 ? (
                                                                            <ul>
                                                                                {selectedMantenimiento.actividades.map((actividad, index) => (
                                                                                    <li key={index} className="mb-4">
                                                                                        <div className="font-semibold text-gray-900">{actividad.nombre}</div>
                                                                                        <div className="text-sm text-gray-600">{actividad.descripcion || "Descripción no disponible"}</div>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <p>No hay actividades asociadas</p>
                                                                        )}
                                                                    </ScrollArea>
                                                                </TabsContent>
                                                            </Tabs>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-center">No hay mantenimientos asociados.</p>
                                        )}
                                    </CardContent>

                                    {/* Footer con botón de cerrar */}
                                    <div className="flex justify-end p-4 bg-gray-100">
                                        <Button onClick={closeHistorialModal} variant="outline" className="bg-white text-gray-800">
                                            Cerrar
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </Modal>




                    )}


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
