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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
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
      const response = await api.get(`/mantenimientos/${maintenance.id}`);
      console.log('Maintenance data:', response.data);

      setSelectedMaintenance({
        ...response.data.mantenimiento,
        componentes: response.data.componentes
      });

      setOpenDialog(true);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al cargar los detalles del mantenimiento';
      if (error.response) {
        console.log('Error response:', error.response);
        errorMessage = `Error ${error.response.status}: ${error.response.data.message || 'Error del servidor'}`;
      }
      setSelectedMaintenance({
        ...maintenance,
        error: errorMessage
      });
      setOpenDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setTabValue(0);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await api.put(`/mantenimientos/${selectedMaintenance.id}`, selectedMaintenance);
      setIsEditing(false);
      const response = await api.get('/mantenimientos');
      setData(response.data);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedMaintenance(prev => ({ ...prev, [name]: value }));
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
  }, []);

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
                        label="Tipo"
                        value={selectedMaintenance.tipo || ''}
                        fullWidth
                        disabled={!isEditing}
                        name="tipo"
                        onChange={handleInputChange}
                      />
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
                      {selectedMaintenance.tipo !== 'Interno' && (
                        <>
                          <TextField
                            label="Proveedor"
                            value={selectedMaintenance.proveedor || ''}
                            fullWidth
                            disabled={!isEditing}
                            name="proveedor"
                            onChange={handleInputChange}
                          />
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
                  {selectedMaintenance?.componentes?.length > 0 ? (
                    <List>
                      {selectedMaintenance.componentes.map((componente) => (
                        <ListItem 
                          key={componente.id}
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
                                  {componente.nombre}
                                </Typography>
                                <Chip 
                                  label={`Cantidad: ${componente.cantidad}`}
                                  color="primary"
                                  size="small"
                                />
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
                      No hay componentes registrados
                    </Typography>
                  )}
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

