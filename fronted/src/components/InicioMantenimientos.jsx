import React, { useState, useEffect } from 'react';
import { Home, ShoppingCart, PenTool, FileText, LogOut, Box as Box1, Search } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Box,
  InputAdornment,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  CircularProgress,
  Grid,
  Alert,
  Snackbar,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Build as BuildIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Engineering as EngineeringIcon,
  ListAlt as ListAltIcon,
  Computer as ComputerIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import ModalEdicionMantenimiento from './EditarMantenimiento';

const endpoint = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: endpoint,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#2f3b52',
      light: '#4c5a75',
      dark: '#1a2538',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e74c3c',
      light: '#ff6b5b',
      dark: '#c0392b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#2f3b52',
      secondary: '#34495e',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '14px',
          backgroundColor: '#ffffff',
          '&:focus': {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2f3b52',
            },
          },
        },
      },
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MaintenanceTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    id: '',
    codigo_mantenimiento: '',
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    proveedor: '',
    contacto_proveedor: '',
    costo: '',
    observaciones: '',
    estado: '',
  });

  const [data, setData] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [equipoSeleccionado, setSelectedEquip] = useState(null);
  const [page, setPage] = useState(1); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [proveedores, setProveedores] = useState([]);
  const [isLoadingProveedores, setIsLoadingProveedores] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [componentQuantity, setComponentQuantity] = useState(1);
  const [componentChanges, setComponentChanges] = useState({ added: [], removed: [] });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [availableActivities, setAvailableActivities] = useState([]);
  const [open, setOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: Box1, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/reportes' },
  ];

  const navigate = useNavigate();
  const fetchActividades = async () => {
    try {
      const response = await api.get('/actividades');
      if (response.status === 200) {
        const actividadesArray = Array.isArray(response.data) ? response.data : [];
        setAvailableActivities(actividadesArray);
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      setAvailableActivities([]);
    } finally {

    }
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleSeleccionarEquipo = (equipo) => {
    setSelectedEquip(equipo);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  // Usar el hook useEffect para cargar las actividades al montar el componente
  useEffect(() => {
    fetchActividades();
  }, []);
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const fetchProveedores = async () => {
    setIsLoadingProveedores(true);
    try {
      const response = await api.get('/proveedores');
      if (response.status === 200) {
        const proveedoresArray = Array.isArray(response.data) ? response.data : [];
        setProveedores(proveedoresArray);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      setProveedores([]);
    } finally {
      setIsLoadingProveedores(false);
    }
  };

  const handleSelectComponent = (e, equipoId) => {
    setSelectedMaintenance((prevState) => ({
      ...prevState,
      equipos: prevState.equipos.map((equipo) =>
        equipo.id === equipoId
          ? { ...equipo, selectedComponent: e.target.value }
          : equipo
      ),
    }));
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const handleAddEquipos = (equipos) => {
    setSelectedMaintenance((prevState) => ({
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
  };

  const handleConfirmChange = (newStatus) => {
    setPendingStatus(newStatus);
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (pendingStatus) {
      await handleUpdateStatus(selectedMaintenance.id, pendingStatus);
      setPendingStatus(null);
    }
    setConfirmDialogOpen(false);
  };

  const cancelStatusChange = () => {
    setPendingStatus(null);
    setConfirmDialogOpen(false);
  };

  const handleSetComponentQuantity = (e, equipoId) => {
    setSelectedMaintenance((prevState) => ({
      ...prevState,
      equipos: prevState.equipos.map((equipo) =>
        equipo.id === equipoId
          ? { ...equipo, componentQuantity: parseInt(e.target.value) || 1 }
          : equipo
      ),
    }));
  };

  const handleAddComponentToEquipo = (equipoId) => {
    setSelectedMaintenance((prevState) => ({
      ...prevState,
      equipos: prevState.equipos.map((equipo) =>
        equipo.id === equipoId
          ? {
            ...equipo,
            componentes: [
              ...equipo.componentes,
              {
                id: parseInt(equipo.selectedComponent),
                nombre: availableComponents.find((c) => c.id === parseInt(equipo.selectedComponent))?.nombre || '',
                cantidad: equipo.componentQuantity || 1,
              },
            ],
            selectedComponent: '',
            componentQuantity: 1,
          }
          : equipo
      ),
    }));
  };

  const handleRemoveComponent = (equipoId, componenteId) => {
    setSelectedMaintenance((prevState) => ({
      ...prevState,
      equipos: prevState.equipos.map((equipo) =>
        equipo.id === equipoId
          ? {
            ...equipo,
            componentes: equipo.componentes.filter((comp) => comp.id !== componenteId),
          }
          : equipo
      ),
    }));
  };

  const filteredData = data.filter((item) => {
    return (
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase().includes(value.toLowerCase());
      }) &&
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const handleReturn = () => {
    navigate('/Main');
  };

  const handleNewMaintenance = () => {
    navigate('/AniadirMantenimiento');
  };

  const handleMaintenanceClick = async (maintenance) => {
    setIsLoading(true);
    setSelectedMaintenance(null);
    try {
      const response = await api.get(`/mantenimientoDetalles/${maintenance.id}`);
      const maintenanceData = response.data;
      setSelectedMaintenance(maintenanceData);
      handleOpenModal();
      if (maintenanceData.tipo === 'Externo') {
        await fetchProveedores();
      }

      setOpenDialog(false);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al cargar los detalles del mantenimiento';
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.message || 'Error del servidor'}`;
      }
      setSelectedMaintenance({
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setTabValue(0);
    setComponentChanges({ added: [], removed: [] });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Verificar si hay actividades y equipos
    if (selectedMaintenance.actividades.length === 0) {
      setSnackbarMessage('No se puede guardar el mantenimiento sin actividades');
      setSnackbarOpen(true);
      return; // Detiene la ejecución si no hay actividades
    }

    if (selectedMaintenance.equipos.length === 0) {
      setSnackbarMessage('No se puede guardar el mantenimiento sin equipos');
      setSnackbarOpen(true);
      return; // Detiene la ejecución si no hay equipos
    }

    try {
      // Guardar los cambios en el mantenimiento
      await api.put(`/mantenimientosDetalles`, selectedMaintenance);
      const response = await api.get('/mantenimientos');
      setData(response.data);
      setComponentChanges({ added: [], removed: [] });
      setIsEditing(false);
      setOpenDialog(false);
      setSnackbarMessage('Cambios guardados correctamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      setSnackbarMessage('Error al guardar los cambios');
      setSnackbarOpen(true);
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedMaintenance((prev) => {
      const updatedState = { ...prev, [name]: value };

      if (name === 'tipo') {
        if (value === 'Externo') {
          fetchProveedores();
        } else if (value === 'Interno') {
          updatedState.proveedor = '';
          updatedState.contacto_proveedor = '';
          updatedState.costo = '';
          setProveedores([]);
        }
      }
      return updatedState;
    });
  };

  const fetchAvailableComponents = async () => {
    try {
      const response = await api.get('/componentes');
      setAvailableComponents(response.data);
    } catch (error) {
      console.error('Error al cargar los componentes disponibles:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const guardarEditar = (event, newValue) => {
    console.log(selectedMaintenance)
    try {
      api.put(`/mantenimientosDetalles`,
        selectedMaintenance)
        .then(response => {
          console.log('Mantenimiento actualizado exitosamente:', response.data);
        })
        .catch(error => {
          console.error('Error al actualizar mantenimiento:', error);
        });


    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleSelectActivity = (actividadId) => {
    console.log(actividadId);
    console.log(availableActivities);
    const selectedActivity = availableActivities.find((actividad) => actividad.id == actividadId);
    console.log(selectedActivity);

    // Verifica si la actividad ya está en el array de actividades
    if (selectedActivity && !selectedMaintenance.actividades.some((actividad) => actividad.id === selectedActivity.id)) {
      setSelectedMaintenance({
        ...selectedMaintenance,
        actividades: [...selectedMaintenance.actividades, selectedActivity],
      });
    } else {
      // Si la actividad ya está, no hacer nada
    }
  };
  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Función para eliminar una actividad de selectedMaintenance
  const handleDeleteActividad = (id) => {
    setSelectedMaintenance({
      ...selectedMaintenance,
      actividades: selectedMaintenance.actividades.filter(
        (actividad) => actividad.id !== id
      ),
    });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/mantenimientos/${id}/estado`, { estado: newStatus });
      if (response.data && response.data.estado) {
        setSnackbarMessage(`Estado actualizado correctamente de ${response.data.estadoAnterior} a ${response.data.estado}`);
        setSnackbarOpen(true);

        // Actualizar el estado en la tabla
        setData(prevData =>
          prevData.map(item =>
            item.id === id ? { ...item, estado: response.data.estado } : item
          )
        );

        // Si el mantenimiento está seleccionado, actualizar también su estado
        if (selectedMaintenance && selectedMaintenance.id === id) {
          setSelectedMaintenance(prev => ({ ...prev, estado: response.data.estado }));
        }
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      let errorMessage = 'Error al actualizar el estado';
      if (error.response && error.response.data) {
        errorMessage += ': ' + (error.response.data.error || error.response.data.message);
        console.error('Traza del error:', error.response.data.trace);
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    api.get('/mantenimientos')
      .then((response) => {
        setData(response.data);
        console.log(response.data)
      })

      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
    fetchProveedores();
    fetchAvailableComponents();
  }, []);


  useEffect(() => {
    if (selectedMaintenance?.tipo === 'Externo') {
      fetchProveedores();
    }
  }, [selectedMaintenance?.tipo]);
  useEffect(() => {
    fetchAvailableComponents();
  }, []);
  useEffect(() => {
    if (!openDialog) {
      setComponentChanges({ added: [], removed: [] });
    }
  }, [openDialog]);
  const handleSaveEditionEquip = (actividades, componentes, observacion) => {
    setSelectedMaintenance((prev) => {
      const nuevosEquipos = prev.equipos.map((equipo) => {
        // Identificar el equipo seleccionado y actualizar sus arrays
        if (equipo.id == equipoSeleccionado.id) {
          return {
            ...equipo,
            actividades: actividades
            ,
            componentes: componentes
            ,
            observacion: observacion
          };
        }
        return equipo; // Retornar el resto de los equipos sin modificaciones
      });

      // Devolver el nuevo estado con los equipos actualizados
      return { ...prev, equipos: nuevosEquipos };
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  return (

    <ThemeProvider theme={theme}>

      <Box sx={{
        display: 'grid', // Cambiamos a grid layout
        gridTemplateColumns: '250px 1fr', // Sidebar toma 250px, contenido ocupa el resto
        gap: '16px', // Espaciado entre las secciones
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}>
        <aside className="bg-[#1a374d] text-white flex flex-col h-screen sticky top-0">
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
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Salir
            </button>
          </div>
        </aside>
        <div style={{ paddingRight: '16px' }}>
          <Paper elevation={3} sx={{ padding: '24px', marginBottom: '24px', backgroundColor: 'primary.main' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>
              <BuildIcon sx={{ marginRight: '8px', verticalAlign: 'middle' }} />
              ESTADO DE MANTENIMIENTOS
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleReturn}
            >
              Regresar
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleNewMaintenance}
            >
              Ingresar nuevo mantenimiento
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Buscar en todos los campos..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: '24px', backgroundColor: 'background.paper' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {Object.keys(filters).map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                value={filters[field]}
                onChange={(e) => handleFilterChange(field, e.target.value)}
                variant="outlined"
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.dark',
                    },
                  }
                }}
              />
            ))}
          </Box>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Código Mantenimiento</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Fecha Fin</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Proveedor</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Contacto Proveedor</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Costo</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice((page - 1) * rowsPerPage, (page) * rowsPerPage + 1).map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.codigo_mantenimiento}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.tipo}
                        color={item.tipo === 'Interno' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(item.fecha_inicio)}</TableCell>
                    <TableCell>{formatDate(item.fecha_fin)}</TableCell>
                    <TableCell>{item.proveedor || '-'}</TableCell>
                    <TableCell>{item.contacto_proveedor || '-'}</TableCell>
                    <TableCell>{item.costo ? `$${item.costo}` : '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.estado}
                        color={item.estado === 'Terminado' ? 'success' : 'warning'}
                        size="small"

                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          color="primary"
                          onClick={() => handleMaintenanceClick(item)}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            }
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          <ModalEdicionMantenimiento
            mantenimiento={selectedMaintenance}
            open={open}
            onClose={handleCloseModal}
            guardar={handleSaveEditionEquip}
            seleccionarEquipo={handleSeleccionarEquipo}
            guardarEditar={guardarEditar}
            handleAniadirEquipos={handleAddEquipos}
          />
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
          />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarMessage.startsWith('Error') ? 'error' : 'success'}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
        
      </Box>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">¿Está seguro de que desea cerrar sesión?</h3>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmLogout}
              >
                Sí
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={cancelLogout}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>

  );
};

export default MaintenanceTable;

