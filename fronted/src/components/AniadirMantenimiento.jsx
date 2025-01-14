import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Home, ShoppingCart, Box, PenTool, FileText, LogOut } from 'lucide-react';
import EquiposModal from './BuscarEquipos';
import EdicionEquipo from './EdicionEquipoMantenimientoModal';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export default function AssetMaintenanceForm() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [showComponents, setShowComponents] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState('Interno');
  const [provider, setProvider] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(null);
  const [contact, setContact] = useState('');
  const [cost, setCost] = useState('');
  const [observations, setObservations] = useState('');
  const [showProveedorButtons, setShowProveedorButtons] = useState(false);
  const [assets, setAssets] = useState([]);
  const [components, setComponents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [idMaximo, setIdMaximo] = useState(null);
  const today = new Date();
  const [equipmentComponents, setEquipmentComponents] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [equipo, setEquipo] = useState(false);
  const [actividades, setActividades] = useState(false);
  const [providers, setProviders] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState({});
  const [mantenimiento, setMantenimiento] = useState({ "equipos": [] });
  const [showTable, setShowTable] = useState(false);
  const [page, setPage] = useState(1); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Equipos por página
  const [openModal, setOpenModal] = useState(false);
  const [confirmacionEquipo, setConfirmacionEquipo] = useState(false);
  const [equipoBorrar, setEquipoBorrar] = useState(null);
  const [mantenimientoInfo, setMantenimientoInfo] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

  const handleConfirmSave = async (e) => {
    setOpenConfirmDialog(false)
    handleSaveMaintenance(e);

  };
  const cancelar = (e) => {
    setOpenConfirmCancelDialog(false);
    navigate("/InicioMantenimientos")
  };
  const seguirMantenimiento = (e) => {
    setOpenConfirmCancelDialog(false);
  };
  const handleClickGuardar = (e) => {
    e.preventDefault();
    let faltanActividadesComponentes = false;
    if (mantenimiento.equipos.length == 0) {
      setEquipo(true);
      setTimeout(() => {
        setEquipo(false);
      }, 1800);
      return;
    }
    mantenimiento.equipos.forEach(equipo => {
      // Verifica si el equipo no tiene componentes ni actividades
      if (equipo.componentes.length === 0 && equipo.actividades.length === 0) {
        faltanActividadesComponentes = true;
        ;
        return; // Termina la ejecución de la función
      }
    });
    if (faltanActividadesComponentes) {
      setActividades(true);
      setTimeout(() => {
        setActividades(false);
      }, 1800)
      return;
    }
    setOpenConfirmDialog(true);
  };
  const handleConfirmCancel = () => {
    setOpenConfirmDialog(false);
  };
  const handleToggleTable = () => {
    setShowTable(!showTable);
    setRegistro(true);
  };
  const borrarEquipo = (equipoBo) => {
    setConfirmacionEquipo(true);
    setEquipoBorrar(equipoBo)

  };
  const handleCancelDeleteEquip = () => {
    setConfirmacionEquipo(false);
    console.log("La eliminación del equipo fue cancelada.");
  };
  const handleDeleteEquipo = () => {
    setMantenimiento((prev) => {
      const nuevosEquipos = prev.equipos.filter(
        (equipo) => equipo.id !== equipoBorrar.id
      );

      return { ...prev, equipos: nuevosEquipos };
    });

    setConfirmacionEquipo(false);
  }
  const handleSaveEditionEquip = (actividades, componentes, observacion, fechaFin) => {
    console.log(equipoSeleccionado);
    setMantenimiento((prev) => {
      const nuevosEquipos = prev.equipos.map((equipo) => {
        // Identificar el equipo seleccionado y actualizar sus arrays
        if (equipo.id == equipoSeleccionado.id) {
          return {
            ...equipo,
            actividades: actividades,
            componentes: componentes,
            observacion: observacion
          };
        }
        return equipo; // Retornar el resto de los equipos sin modificaciones
      });

      // Devolver el nuevo estado con los equipos actualizados y cambiar la fecha de fin
      return {
        ...prev,
        equipos: nuevosEquipos,
        fecha_fin: fechaFin
      };
    });

    // Confirmar el nuevo estado después de la actualización
    setTimeout(() => {
      console.log("Estado actualizado de mantenimiento:", mantenimiento);
    }, 0);
  };



  const openBuscarEquipo = () => {
    setOpenModal(true);

  };
  const cerrarBuscarEquipo = () => {
    setOpenModal(false);

  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: Box, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/reportes' },
  ];

  useEffect(() => {
    axios.get('http://localhost:8000/api/mantenimientos_idMax')
      .then(response => {
        setIdMaximo(response.data + 1);
      })
      .catch(() => {
        setIdMaximo(1);
      });
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/proveedores');
        setProviders(response.data);
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesResponse, componentsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/actividades'),
          axios.get('http://localhost:8000/api/componentes'),
        ]);

        setActivities(activitiesResponse.data);
        setComponents(componentsResponse.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if ((startDate && endDate && new Date(startDate) < new Date(endDate)))
      fetchEquipos();
    else
      setAssets([]);
  }, [startDate, endDate]);

  useEffect(() => {
    const isValid =
      maintenanceType &&
      startDate &&
      endDate &&
      new Date(startDate) < new Date(endDate) &&
      (maintenanceType === "Interno" ||
        (maintenanceType === "Externo" &&
          provider &&
          contact &&
          cost));

    if (isValid) {
      setMantenimientoInfo(true);
    } else {
      setMantenimientoInfo(false);
    }
  }, [maintenanceType, startDate, endDate, provider, contact, cost]);


  const handleComponentChangeSelection = (option) => {
    setSelectedOption(option);
    if (option === "No") {
      setEquipmentComponents({});
    }
  };

  const handleAddComponentToEquipment = (equipoId, componente) => {
    if (!componente || !componente.id) return;
    setEquipmentComponents((prev) => {
      const updated = { ...prev };
      if (!updated[equipoId]) updated[equipoId] = [];
      const existe = updated[equipoId].some((comp) => comp.id === componente.id);
      if (!existe) {
        updated[equipoId].push({ ...componente, cantidad: 1 });
      }
      return updated;
    });
  };

  const handleRemoveComponentFromEquipment = (equipoId, componenteId) => {
    setEquipmentComponents((prev) => {
      const updated = { ...prev };
      updated[equipoId] = updated[equipoId]?.filter((comp) => comp.id !== componenteId) || [];
      return updated;
    });
  };
  const handleCancelMaintenance = async (e) => {
    e.preventDefault();
    setOpenConfirmCancelDialog(true)
  }
  const handleSaveMaintenance = async (e) => {
    e.preventDefault();


    const mantenimientoGu = {
      ...mantenimiento,
      codigo_mantenimiento: `MANT_${idMaximo}`,
      tipo: maintenanceType,
      fecha_inicio: startDate || null,
      fecha_fin: endDate || null,
      proveedor: maintenanceType === "Externo" ? provider : null,
      contacto_proveedor: maintenanceType === "Externo" ? contact : null,
      costo: maintenanceType === "Externo" ? parseFloat(cost) : null,
    };
    console.log(mantenimiento)
    console.log(mantenimientoGu)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/mantenimientosDetalles",
        mantenimientoGu,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSubmit(true);
      setTimeout(() => {
        setSubmit(false);
        navigate("/InicioMantenimientos")
      }, 1800);

    } catch (error) {
      console.error("Error al crear el mantenimiento:", error);
    }
  };

  const fetchEquipos = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/equipoDisponibles', {
        fecha_inicio: startDate,
        fecha_fin: endDate,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setAssets(response.data);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  };

  const handleAddActivity = (e) => {
    const nombre = e.target.value;
    const actividad = activities.find((objeto) => objeto.nombre === nombre);

    if (!actividad) {
      console.error('Actividad no encontrada:', nombre);
      return;
    }

    const selected = { id: actividad.id, nombre: actividad.nombre };
    const existe = selectedActivities.some((activity) => activity.id === actividad.id);

    if (!existe) {
      setSelectedActivities([...selectedActivities, selected]);
    }

    e.target.value = '';
  };

  const handleEquipmentOptionChange = (equipmentId, option) => {
    setEquipmentOptions((prev) => ({
      ...prev,
      [equipmentId]: option,
    }));

    if (option === "No") {
      setEquipmentComponents((prev) => {
        const updated = { ...prev };
        delete updated[equipmentId];
        return updated;
      });
    }
  };

  const handleAddEquipment = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedAsset = assets.find(asset => asset.id === selectedId);

    if (selectedAsset && !selectedEquipments.some(equipment => equipment.id === selectedAsset.id)) {
      setSelectedEquipments([...selectedEquipments, selectedAsset]);
    }
    e.target.value = '';
  };

  const handleRemoveEquipment = (id) => {
    setSelectedEquipments(selectedEquipments.filter(equipment => equipment.id !== id));
  };
  const handleOpenModal = (equipo) => {
    setEquipoSeleccionado(equipo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEquipoSeleccionado(null);
  };
  const handleRemoveActivity = (activity) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
  };

  const handleSelectAsset = (e) => {
    setSelectedAsset(e.target.value);
  };
  const handleAddEquipos = (equipos) => {
    setMantenimiento((prevState) => ({
      ...prevState,
      equipos: [
        ...prevState.equipos,
        ...equipos.map((equipo) => ({
          ...equipo, // Mantener las propiedades actuales del equipo
          actividades: [], // Inicializar el array de actividades
          componentes: [], // Inicializar el array de componentes
        })),
      ],
    }));
    console.log(mantenimiento);
  };

  const handleAddComponent = (e, idEquipo) => {
    const componente = components.find((item) => item.nombre === e.target.value);
    const selected = { equipo_mantenimiento_id: idEquipo, componente_id: componente.id, mantenimiento_id: parseInt(idMaximo) }

    if (selected && !selectedComponents.includes(selected)) {
      setSelectedComponents([...selectedComponents, selected]);
    }
  };

  const handleRemoveComponent = (component) => {
    setSelectedComponents(selectedComponents.filter((c) => c !== component));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Ahora con position fixed */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-[#1a374d] text-white flex flex-col z-10">
        <div className="p-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
            alt="Logo SK Telecom"
            className="h-12 w-auto"
          />
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
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
        <div className="p-4">
          <button
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => navigate('/InicioMantenimientos')}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Regresar
          </button>
        </div>
      </aside>

      {/* Main Content - Con padding-left para el sidebar y scroll independiente */}
      <main className="flex-1 pl-64 w-full h-screen overflow-y-auto bg-gray-100">
        <div className="container mx-auto py-6 px-4">
          {/* Alertas y mensajes */}
          {dateError && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">Rango de fechas inválido</h1>
              </div>
            </div>
          )}
          {submit && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-green-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">Mantenimiento guardado correctamente</h1>
              </div>
            </div>
          )}
          {actividades && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">Hay equipos que no tienen actividades, ni componentes registrados</h1>
              </div>
            </div>
          )}
          {equipo && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">No ha registrado equipos</h1>
              </div>
            </div>
          )}

          {/* Contenido del formulario */}
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Mantenimiento de Equipos</h1>

            <div className="space-y-6">
              <div>
                <p className="mb-4 text-center">
                  ¿El mantenimiento se realizará dentro de la institución (interno) o será externo?
                </p>
                <div className="flex justify-center items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="maintenance-type"
                      value="Interno"
                      checked={maintenanceType === 'Interno'}
                      onChange={() => {
                        setMaintenanceType('Interno');
                        setProvider('');
                        setContact('');
                        setCost('');
                        setSelectedActivities([]);
                        setSelectedComponents([]);
                        setObservations('');

                      }}
                      className="mr-2 accent-black"
                      disabled={registro}
                    />
                    Interno
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="maintenance-type"
                      value="Externo"
                      checked={maintenanceType === 'Externo'}
                      onChange={() => {
                        setMaintenanceType('Externo');
                        setSelectedActivities([]);
                        setSelectedComponents([]);
                        setObservations('');
                        setProvider('');
                        setContact('');
                        setCost('');
                      }}
                      className="mr-2 accent-black"
                      disabled={registro}
                    />
                    Externo
                  </label>
                </div>
              </div>

              <label className="max-w-[200px] p-2">
                Codigo de Mantenimiento: MANT_{idMaximo}
              </label>

              <form onSubmit={handleClickGuardar}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label>Fecha de Inicio:</label>
                    <br />
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setSelectedEquipments([]);
                      }}
                      locale={es}
                      dateFormat="dd/MM/yyyy"
                      minDate={today}
                      disabled={registro}
                      customInput={
                        <button
                          type="button"
                          className="border border-black p-2 flex items-center text-black w-64">
                          <Calendar className="mr-2 h-4 w-4 text-black" />
                          {startDate ? format(startDate, 'dd/MM/yyyy') : 'dd/mm/aaaa'}

                        </button>
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Fecha Estimada de Fin:</label>
                    <br />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        if (startDate && date < startDate) {
                          alert('La fecha de fin no puede ser anterior a la fecha de inicio');
                          return;
                        }
                        setEndDate(date);
                        setSelectedEquipments([]);
                      }}
                      disabled={registro}
                      locale={es}
                      dateFormat="dd/MM/yyyy"
                      minDate={startDate}

                      customInput={
                        <button
                          type="button"
                          className="border border-black p-2 flex items-center text-black w-64">
                          <Calendar className="mr-2 h-4 w-4 text-black" />
                          {endDate ? format(endDate, 'dd/MM/yyyy') : 'dd/mm/aaaa'}

                        </button>
                      }
                    />
                  </div>
                </div>

                {maintenanceType === 'Externo' && (
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <label htmlFor="proveedor">Proveedor:</label>
                      <select
                        id="proveedor"
                        className="border-2 border-black p-2 w-full"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        required
                        disabled={registro}
                      >
                        <option value="" disabled>Seleccione un proveedor</option>
                        {providers.map((providerOption, index) => (
                          <option key={index} value={providerOption}>
                            {providerOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contacto">Contacto del Mantenimiento:</label>
                      <input
                        required
                        id="contacto"
                        maxLength="25"
                        className="border-2 border-black p-2 w-full"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        disabled={registro}

                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="costo">Costo del Mantenimiento:</label>
                      <input
                        required
                        id="costo"
                        className="border-2 border-black p-2 w-full"
                        type="number"
                        min="100"
                        max="100000"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        disabled={registro}
                      />
                    </div>
                  </div>
                )}
                <div>
                  {/* Botón para mostrar/ocultar la tabla */}



                  {/* Tabla de equipos visible solo si showTable es true */}
                  {showTable && (

                    <div>
                      <div className="h-8"></div>
                      <Button variant="contained" color="primary" onClick={openBuscarEquipo}>
                        Añadir equipo
                      </Button>
                      <div className="h-8"></div>
                      <EquiposModal open={openModal} onClose={cerrarBuscarEquipo} onAddEquipo={handleAddEquipos} equiposSe={mantenimiento.equipos} fechaInicio={startDate} fechaFin={endDate} />
                      {/* Si no hay equipos, mostrar mensaje */}
                      {mantenimiento.equipos.length === 0 ? (
                        <div>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Nombre Producto</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Código Barras</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Tipo Equipo</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Fecha Adquisición</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Ubicación</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Proceso Compra ID</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Acciones</TableCell>
                              </TableRow>
                            </TableHead>
                          </Table>
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            align="center"
                          >
                            No ha registrado ningún equipo.
                          </Typography>
                        </div>
                      ) : (
                        <>
                          <TableContainer component={Paper} elevation={3}>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Nombre Producto</TableCell>
                                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Código Barras</TableCell>
                                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Tipo Equipo</TableCell>
                                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Fecha Adquisición</TableCell>
                                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Ubicación</TableCell>
                                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Proceso Compra ID</TableCell>
                                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Acciones</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {mantenimiento.equipos.slice((page-1) * rowsPerPage,(page)* rowsPerPage+1)


                                  .map((equipo, index) => (
                                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                      <TableCell>{equipo.Nombre_Producto}</TableCell>
                                      <TableCell>{equipo.Codigo_Barras}</TableCell>
                                      <TableCell>{equipo.Tipo_Equipo}</TableCell>
                                      <TableCell>{equipo.Fecha_Adquisicion}</TableCell>
                                      <TableCell>{equipo.Ubicacion_Equipo}</TableCell>
                                      <TableCell>{equipo.proceso_compra_id}</TableCell>
                                      <TableCell>
                                        <Button
                                          variant="contained"
                                          onClick={() => handleOpenModal(equipo)}
                                          style={{ marginRight: '10px' }}
                                          size="small"
                                        >
                                          Editar
                                        </Button>
                                        <Button
                                          variant="contained"
                                          onClick={() => borrarEquipo(equipo)}
                                          color="error"
                                          size="small"
                                        >
                                          Borrar
                                        </Button>

                                      </TableCell>
                                    </TableRow>



                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {confirmacionEquipo == true && (
                            <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h3 className="text-lg font-semibold mb-4">
                                  ¿Está seguro de que desea eliminar el equipo ?
                                </h3>
                                <div className="flex justify-between">
                                  <button
                                    onClick={handleDeleteEquipo}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                  >
                                    Confirmar
                                  </button>
                                  <button
                                    onClick={handleCancelDeleteEquip}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Paginación */}
                          <div class="w-1/2 mx-auto">
                            <Pagination
                                count={Math.ceil(mantenimiento.equipos.length / rowsPerPage)}
                                page={page}
                                onChange={handleChangePage}
                                sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                            />
                          </div>
                          <EdicionEquipo open={modalOpen} handleClose={handleCloseModal} equipo={equipoSeleccionado || {}}
                            actividadesSe={equipoSeleccionado != null ? equipoSeleccionado.actividades : []}
                            componentesSe={equipoSeleccionado != null ? equipoSeleccionado.componentes : []}
                            guardarActivComp={handleSaveEditionEquip} />

                        </>
                      )}
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
                        >
                          Guardar
                        </button>
                      </div>

                    </div>

                  )}
                </div>
                <div className="h-8"></div>
                <div className="flex justify-end space-x-4">
                  <div className="h-8"></div> {/* Espaciador vacío para mover los botones hacia abajo */}
                  {showTable ? (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Guardar
                    </button>
                  ) : (
                    <Tooltip
                      title={
                        !mantenimientoInfo
                          ? "Complete la información del mantenimiento correctamente"
                          : ""
                      }
                    >
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleToggleTable}
                          style={{ textTransform: "none" }}
                          disabled={!mantenimientoInfo}
                        >
                          Registro de equipos
                        </Button>
                      </span>
                    </Tooltip>
                  )}

                  <button
                    onClick={handleCancelMaintenance}
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                </div>
                <Dialog open={openConfirmDialog} onClose={handleConfirmCancel}>
                  <DialogTitle>Confirmación</DialogTitle>
                  <DialogContent>
                    <h1>¿Esta seguro de guardar el matenimiento?</h1>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleConfirmCancel} color="secondary"
                      sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'darkred'
                        }
                      }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleConfirmSave} color="primary"
                      sx={{
                        backgroundColor: 'blue',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'darkred'
                        }
                      }}>
                      Confirmar
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog open={openConfirmCancelDialog} onClose={handleConfirmCancel}>
                  <DialogTitle>Confirmación</DialogTitle>
                  <DialogContent>
                    <h1>¿Esta seguro de cancelar la creacion del mantenimiento?</h1>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={seguirMantenimiento} color="secondary"
                      sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'darkred'
                        }
                      }}>
                      Seguir con el registro
                    </Button>
                    <Button onClick={cancelar} color="primary"
                      sx={{
                        backgroundColor: 'blue',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'darkred'
                        }
                      }}>
                      Cancelar el registro
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

