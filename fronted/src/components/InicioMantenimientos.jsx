import React, { useState, useEffect } from 'react';
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
import { Home, ShoppingCart, BoxIcon, PenTool, FileText, LogOut } from 'lucide-react';

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
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: BoxIcon, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/reportes' },
  ];

  const fetchActividades = async () => {
    try {
      const response = await api.get('/actividades');
      if (response.status === 200) {
        const actividadesArray = Array.isArray(response.data) ? response.data : [];
        setAvailableActivities( actividadesArray);
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      setAvailableActivities(  []);
    } finally {
      
    }
  };
  
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

  const handleConfirmChange = (newStatus) => {
    setPendingStatus(newStatus);
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (pendingStatus) {
      await handleUpdateStatus(selectedMaintenance.id, pendingStatus);
      setPendingStatus(null);

      if (pendingStatus === "Terminado") {
        setOpenDialog(false);
      }
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

      if (maintenanceData.tipo === 'Externo') {
        await fetchProveedores();
      }

      setOpenDialog(true);
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
    if (selectedMaintenance.actividades.length === 0) {
      setSnackbarMessage('No se puede guardar el mantenimiento sin actividades');
      setSnackbarOpen(true);
      return;
    }
  
    if (selectedMaintenance.equipos.length === 0) {
      setSnackbarMessage('No se puede guardar el mantenimiento sin equipos');
      setSnackbarOpen(true);
      return;
    }
  
    try {
      await api.put(`/mantenimientosDetalles/${selectedMaintenance.id}`, selectedMaintenance);
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
      // Si la actividad ya está, no hacer nada
    }
  };
  
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

        setData(prevData =>
          prevData.map(item =>
            item.id === id ? { ...item, estado: response.data.estado } : item
          )
        );

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

  useEffect(() => {
    api.get('/mantenimientos')
      .then((response) => {
        const groupedData = response.data.reduce((acc, curr) => {
          const equipos = Array.isArray(curr.equipos) ? curr.equipos : [];
          
          const existing = acc.find(item => item.id === curr.id);
          console.log('Datos de la API:', response.data);

          if (existing) {
            existing.equipos = [...existing.equipos, ...equipos];
          } else {
            acc.push({
              ...curr,
              equipos,
            });
          }
          return acc;
        }, []);
        setData(groupedData);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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
      <div className="flex-1">
        <ThemeProvider theme={theme}>
          <Box sx={{ padding: '24px', backgroundColor: 'background.default', minHeight: '100vh' }}>
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
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Observaciones</TableCell>
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => (
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
                      <TableCell>{item.observaciones}</TableCell>
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

            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                {isEditing ? 'Editar Mantenimiento' : 'Detalles del Mantenimiento'}
              </DialogTitle>

              <DialogContent sx={{ mt: 2, p: 0 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {selectedMaintenance?.error && (
                      <Alert
                        severity="error"
                        sx={{ m: 2 }}
                        onClose={() => {
                          setSelectedMaintenance(prev => ({ ...prev, error: null }))
                        }}
                      >
                        {selectedMaintenance.error}
                      </Alert>
                    )}
                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                      <Tab icon={<BuildIcon />} label="Detalles" />
                      <Tab icon={<ListAltIcon />} label="Actividades" />
                      <Tab icon={<EngineeringIcon />} label="Componentes" />
                      <Tab icon={<ComputerIcon />} label="Activos" />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                      {selectedMaintenance && (
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)', p: 3 }}>
                          <TextField
                            label="Código Mantenimiento"
                            value={selectedMaintenance.codigo_mantenimiento || ''}
                            fullWidth
                            disabled
                            name="codigo_mantenimiento"
                            onChange={handleInputChange}
                          />
                          <TextField
                            select
                            label="Tipo"
                            value={selectedMaintenance?.tipo || ''}
                            fullWidth
                            disabled={selectedMaintenance?.estado === "Terminado" || !isEditing}
                            name="tipo"
                            onChange={handleInputChange}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value="">Seleccione un tipo</option>
                            <option value="Interno">Interno</option>
                            <option value="Externo">Externo</option>
                          </TextField>

                          <TextField
                            label="Fecha Inicio"
                            type="date"
                            value={selectedMaintenance.fecha_inicio?.split('T')[0] || ''}
                            fullWidth
                            disabled={!isEditing}
                            name="fecha_inicio"
                            onChange={handleInputChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            label="Fecha Fin"
                            type="date"
                            value={selectedMaintenance.fecha_fin?.split('T')[0] || ''}
                            fullWidth
                            disabled={!isEditing}
                            name="fecha_fin"
                            onChange={handleInputChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />

                          {selectedMaintenance.tipo === 'Externo' && (
                            <>
                              {isLoadingProveedores ? (
                                <CircularProgress />
                              ) : (
                                <TextField
                                  select
                                  label="Proveedor"
                                  value={selectedMaintenance?.proveedor || ''}
                                  fullWidth
                                  disabled={!isEditing}
                                  name="proveedor"
                                  onChange={handleInputChange}
                                  SelectProps={{
                                    native: true,
                                  }}
                                  sx={{
                                    '& .MuiSelect-select': {
                                      padding: '16.5px 14px',
                                      backgroundColor: 'background.paper',
                                    },
                                  }}
                                >
                                  <option value=""></option>
                                  {proveedores.map((prov, index) => (
                                    <option key={index} value={typeof prov === 'string' ? prov : prov.nombre}>
                                      {typeof prov === 'string' ? prov : prov.nombre}
                                    </option>
                                  ))}
                                </TextField>
                              )}
                              <TextField
                                label="Contacto Proveedor"
                                value={selectedMaintenance.contacto_proveedor || ''}
                                fullWidth
                                disabled={!isEditing}
                                name="contacto_proveedor"
                                onChange={handleInputChange}
                              />
                              <TextField
                                label="Costo"
                                value={selectedMaintenance.costo || ''}
                                fullWidth
                                disabled={!isEditing}
                                name="costo"
                                onChange={handleInputChange}
                                type="number"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                              />
                            </>
                          )}
                          <TextField
                            label="Observaciones"
                            value={selectedMaintenance.observaciones || ''}
                            fullWidth
                            multiline
                            rows={4}
                            disabled={!isEditing}
                            name="observaciones"
                            onChange={handleInputChange}
                            sx={{ gridColumn: '1 / -1' }}
                          />
                          <TextField
                            select
                            label="Estado"
                            value={selectedMaintenance.estado || 'No terminado'}
                            fullWidth
                            disabled={selectedMaintenance.estado === 'Terminado'}
                            name="estado"
                            onChange={(e) => handleConfirmChange(e.target.value)}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value="No terminado">No Terminado</option>
                            <option value="Terminado">Terminado</option>


                            <Dialog
                          open={confirmDialogOpen}
                          onClose={cancelStatusChange}
                        >
                          <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
                          <DialogContent>
                            <Typography>
                              ¿Está seguro de marcar como <b>{pendingStatus}</b> el mantenimiento?
                            </Typography>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={cancelStatusChange} color="primary">
                              Cancelar
                            </Button>
                            <Button
                              onClick={confirmStatusChange}
                              color="secondary"
                              variant="contained"
                            >
                              Confirmar
                            </Button>
                          </DialogActions>
                        </Dialog>
                          </TextField>
                        </Box>
                      )}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                      {isEditing ? (
                        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Actividades disponibles:
                          </Typography>
                          <TextField
                            select
                            label="Seleccionar Actividad"
                            onChange={(e) => handleSelectActivity(e.target.value)}
                            fullWidth
                            sx={{
                              minWidth: 200,
                              '& .MuiSelect-select': {
                                padding: '16.5px 14px',
                                backgroundColor: 'background.paper',
                              },
                            }}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value="">Seleccione una actividad</option>
                            {availableActivities.map((actividad) => (
                              <option key={actividad.id} value={actividad.id}>
                                {actividad.nombre}
                              </option>
                            ))}
                          </TextField>
                          <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
                            Actividades seleccionadas:
                          </Typography>
                          <List>
                            {selectedMaintenance.actividades.map((actividad) => (
                              <ListItem
                                key={actividad.id}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  mb: 1,
                                  backgroundColor: 'background.paper',
                                }}
                              >
                                <ListItemText
                                  primary={<Typography variant="subtitle1" fontWeight="bold">{actividad.nombre}</Typography>}
                                />
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleDeleteActividad(actividad.id)}
                                  startIcon={<DeleteIcon />}
                                >
                                  Eliminar
                                </Button>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      ) : (
                        <TabPanel value={tabValue} index={1}>
                        {selectedMaintenance?.actividades?.length > 0 ? (
                          <List>
                            {selectedMaintenance.actividades.map((actividad) => (
                              <ListItem
                                key={actividad.id}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  mb: 1,
                                  backgroundColor: 'background.paper'
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {actividad.nombre}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                              No hay actividades registradas
                            </Typography>
                          </Box>
                        )}
                      </TabPanel>
                        )}
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {selectedMaintenance?.equipos?.length > 0 ? (
                          <List>
                            {selectedMaintenance.equipos.map((equipo) => (
                              <Box key={equipo.id} sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                  Activo: {equipo.Nombre_Producto}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  Código de Barras: {equipo.Codigo_Barras}
                                </Typography>

                                {isEditing && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: 2,
                                      alignItems: 'flex-start',
                                      p: 2,
                                      border: '1px solid',
                                      borderColor: 'divider',
                                      borderRadius: 1,
                                      bgcolor: 'background.paper',
                                      mb: 2,
                                    }}
                                  >
                                    <TextField
                                      select
                                      label="Componente"
                                      value={equipo.selectedComponent || ''}
                                      onChange={(e) => handleSelectComponent(e, equipo.id)}
                                      sx={{
                                        minWidth: 200,
                                        '& .MuiSelect-select': {
                                          padding: '16.5px 14px',
                                          backgroundColor: 'background.paper',
                                        },
                                      }}
                                      SelectProps={{
                                        native: true,
                                      }}
                                    >
                                      <option value=""></option>
                                      {availableComponents.map((comp) => (
                                        <option key={comp.id} value={comp.id}>
                                          {comp.nombre}
                                        </option>
                                      ))}
                                    </TextField>
                                    <TextField
                                      type="number"
                                      label="Cantidad"
                                      value={equipo.componentQuantity || ''}
                                      onChange={(e) => handleSetComponentQuantity(e, equipo.id)}
                                      InputProps={{ inputProps: { min: 1 } }}
                                      sx={{ width: 100 }}
                                    />
                                    <Button
                                      variant="contained"
                                      onClick={() => handleAddComponentToEquipo(equipo.id)}
                                      startIcon={<AddIcon />}
                                      disabled={!equipo.selectedComponent}
                                    >
                                      Agregar
                                    </Button>
                                  </Box>
                                )}

                                {equipo.componentes?.length > 0 ? (
                                  <List>
                                    {equipo.componentes.map((componente) => (
                                      <ListItem
                                        key={componente.id}
                                        sx={{
                                          border: '1px solid',
                                          borderColor: 'divider',
                                          borderRadius: 1,
                                          mb: 1,
                                          backgroundColor: 'background.paper',
                                        }}
                                        secondaryAction={
                                          isEditing && (
                                            <IconButton
                                              edge="end"
                                              aria-label="delete"
                                              onClick={() => handleRemoveComponent(equipo.id, componente.id)}
                                              color="error"
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          )
                                        }
                                      >
                                        <ListItemText
                                          primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                              <Typography variant="subtitle1" fontWeight="bold">
                                                {componente.nombre}
                                              </Typography>
                                              <Chip label={`Cantidad: ${componente.cantidad}`} color="primary" size="small" />
                                            </Box>
                                          }
                                          secondary={
                                            componente.descripcion && (
                                              <Typography component="span" display="block">
                                                {componente.descripcion}
                                              </Typography>
                                            )
                                          }
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                ) : (
                                  <Typography color="text.secondary" align="center">
                                    No hay componentes registrados para este equipo
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </List>
                        ) : (
                          <Typography color="text.secondary" align="center">
                            No hay equipos registrados
                          </Typography>
                        )}
                      </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                      {selectedMaintenance?.equipos?.length > 0 ? (
                        <List>
                          {selectedMaintenance.equipos.map((equipo) => (
                            <ListItem
                              key={equipo.id}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                                backgroundColor: 'background.paper'
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {equipo.Nombre_Producto}
                                    </Typography>
                                    <Chip
                                      label={equipo.Tipo_Equipo}
                                      color="primary"
                                      size="small"
                                    />
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography component="span" display="block">
                                      Código de Barras: {equipo.Codigo_Barras}
                                    </Typography>
                                    <Typography component="span" display="block">
                                      Ubicación: {equipo.Ubicacion_Equipo}
                                    </Typography>
                                    {equipo.Descripcion_Equipo && (
                                      <Typography component="span" display="block">
                                        Descripción: {equipo.Descripcion_Equipo}
                                      </Typography>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography color="text.secondary" align="center">
                          No hay equipos registrados
                        </Typography>
                      )}
                    </TabPanel>
                  </>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1 }}>
                {isEditing ? (
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    sx={{ color: 'primary.contrastText' }}
                  >
                    Guardar
                  </Button>
                ) : (
                  selectedMaintenance?.estado !== "Terminado" && (
                    <Button
                      onClick={handleEdit}
                      startIcon={<EditIcon />}
                      variant="contained"
                      color="primary"
                      sx={{ color: 'primary.contrastText' }}
                    >
                      Editar
                    </Button>
                  )
                )}
                <Button
                  onClick={handleCloseDialog}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    }
                  }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
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
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default MaintenanceTable;

