import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const endpoint = 'http://localhost:8000/api';

// Create an axios instance with default config
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
  const [componentChanges, setComponentChanges] = useState({ added: [], removed: [] }); // Added state for component changes

  const navigate = useNavigate();

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const fetchProveedores = async () => {
    setIsLoadingProveedores(true);
    try {
      const response = await api.get('/proveedores');
      console.log('Proveedores response:', response.data);
      if (response.status === 200) {
        // Ensure we're setting the array of provider names directly
        const proveedoresArray = Array.isArray(response.data) ? response.data : [];
        setProveedores(proveedoresArray);
      } else {
        console.error('Error: El formato de los datos no es válido.', response.data);
        setProveedores([]);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error.message);
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
                  nombre: availableComponents.find((c) => c.id === equipo.selectedComponent)?.nombre || '',
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
      const response = await axios.get(`http://localhost:8000/api/mantenimientoDetalles/${maintenance.id}`);
      console.log('Maintenance data:', response.data);
      console.log('Maintenance data:', maintenance.id);

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
        console.log('Error response:', error.response);
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
    try {
      console.log("Mantenimiento guardado")
      console.log(selectedMaintenance)
      // 1. Actualizar la información del mantenimiento
      await api.put(`/mantenimientosDetalles/${selectedMaintenance.id}`,
        selectedMaintenance,
      );
      console.log(componentChanges);
      // 2. Procesar los componentes añadidos
      

      // 4. Recargar los datos actualizados
      const response = await api.get('/mantenimientos');
      setData(response.data);

      // Resetear estado de cambios
      setComponentChanges({ added: [], removed: [] });
      setIsEditing(false);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedMaintenance((prev) => {
      const updatedState = { ...prev, [name]: value };

      if (name === 'tipo') {
        console.log(`Tipo seleccionado: ${value}`);
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
      console.error('Error al cargar componentes:', error);
    }
  };

  const handleAddComponent = () => {
    if (!selectedComponent) return;

    const componentToAdd = availableComponents.find(c => c.id === parseInt(selectedComponent));
    if (!componentToAdd) return;

    // Actualiza el estado local del mantenimiento
    setSelectedMaintenance((prev) => ({
      ...prev,
      componentes: [
        ...(prev.componentes || []),
        { ...componentToAdd, cantidad: componentQuantity },
      ],
    }));

    // Añade al estado de cambios
    setComponentChanges((prev) => ({
      ...prev,
      added: [
        ...prev.added,
        { id: componentToAdd.id, cantidad: componentQuantity },
      ],
    }));

    setSelectedComponent('');
    setComponentQuantity(1);
  };



  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    api.get('/mantenimientos')
      .then((response) => {
        setData(response.data);
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
    if (!openDialog) {
      setComponentChanges({ added: [], removed: [] });
    }
  }, [openDialog]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  return (
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
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Observaciones</TableCell>
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
                  <TableCell>{item.observaciones}</TableCell>
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
                  <Tab icon={<ComputerIcon />} label="Equipos" />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                  {selectedMaintenance && (
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
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
                        disabled={!isEditing}
                        name="tipo"
                        onChange={handleInputChange}
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="Interno">Interno</option>
                        <option value="Externo">Externo</option>
                      </TextField>




                      <TextField
                        label="Fecha Inicio"
                        value={formatDate(selectedMaintenance.fecha_inicio) || ''}
                        fullWidth
                        disabled={!isEditing}
                        name="fecha_inicio"
                        onChange={handleInputChange}
                      />
                      <TextField
                        label="Fecha Fin"
                        value={formatDate(selectedMaintenance.fecha_fin) || ''}
                        fullWidth
                        disabled={!isEditing}
                        name="fecha_fin"
                        onChange={handleInputChange}
                      />
                      {selectedMaintenance.tipo == 'Externo' && (
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
                            >
                              <option value="">Seleccione un proveedor</option>
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
                      />
                    </Box>
                  )}
                </TabPanel>
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
                            secondary={`ID: ${actividad.id}`}
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
                <TabPanel value={tabValue} index={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedMaintenance?.equipos?.length > 0 ? (
                      <List>
                        {selectedMaintenance.equipos.map((equipo) => (
                          <Box key={equipo.id} sx={{ mb: 3 }}>
                            {/* Encabezado del equipo */}
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                              Equipo: {equipo.Nombre_Producto}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Código de Barras: {equipo.Codigo_Barras}
                            </Typography>

                            {/* Opción para agregar componentes al equipo */}
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
                                  sx={{ minWidth: 200 }}
                                  SelectProps={{
                                    native: true,
                                  }}
                                >
                                  <option value="">Seleccione un componente</option>
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

                            {/* Lista de componentes del equipo */}
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
                                        <>
                                          <Typography component="span" display="block">
                                            ID: {componente.id}
                                          </Typography>
                                          {componente.descripcion && (
                                            <Typography component="span" display="block">
                                              Descripción: {componente.descripcion}
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
              <Button
                onClick={handleEdit}
                startIcon={<EditIcon />}
                variant="contained"
                color="primary"
                sx={{ color: 'primary.contrastText' }}
              >
                Editar
              </Button>
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
      </Box>
    </ThemeProvider>
  );
};

export default MaintenanceTable;

