import React, { useState } from 'react';
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
} from '@mui/material';
import { Search as SearchIcon, Build as BuildIcon, ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

// Crear un tema personalizado con más colores
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff80ab',
      dark: '#f50057',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

// Datos de ejemplo
const mockData = [
  {
    id: 1,
    codigo_mantenimiento: 'MNT001',
    tipo: 'Preventivo',
    fecha_inicio: '2023-01-01',
    fecha_fin: '2023-01-05',
    proveedor: 'TechFix Inc.',
    contacto_proveedor: 'John Doe',
    costo: 500,
    observaciones: 'Mantenimiento rutinario',
  },
  {
    id: 2,
    codigo_mantenimiento: 'MNT002',
    tipo: 'Correctivo',
    fecha_inicio: '2023-02-15',
    fecha_fin: '2023-02-20',
    proveedor: 'RepairPro',
    contacto_proveedor: 'Jane Smith',
    costo: 750,
    observaciones: 'Reparación de emergencia',
  },
];

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

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredData = mockData.filter((item) => {
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
    navigate('/Main'); // Redirige a la página "Inicio"
  };
  
  const handleNewMaintenance = () => {
    navigate('/AniadirMantenimiento'); // Redirige a la página "Inicio"
  };
  const navigate = useNavigate(); // Hook para redirigir


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '24px', backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ padding: '24px', marginBottom: '24px', backgroundColor: 'primary.light' }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            <BuildIcon sx={{ marginRight: '8px', verticalAlign: 'middle' }} />
            ESTADO DE MANTENIMIENTOS
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Button
  variant="contained"
  color="primary"
  startIcon={<ArrowBackIcon />}
  onClick={handleReturn} // Llama a la función para redirigir
>
  Regresar
</Button>

<Button
  variant="contained"
  color="secondary"
  startIcon={<AddIcon />}
  onClick={handleNewMaintenance} // Llama a la función para redirigir
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
              sx={{ backgroundColor: 'background.paper' }}
            />
          ))}
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código Mantenimiento</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Fin</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Proveedor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contacto Proveedor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Costo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Observaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow 
                  key={item.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.codigo_mantenimiento}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.tipo} 
                      color={item.tipo === 'Preventivo' ? 'success' : 'warning'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.fecha_inicio}</TableCell>
                  <TableCell>{item.fecha_fin}</TableCell>
                  <TableCell>{item.proveedor}</TableCell>
                  <TableCell>{item.contacto_proveedor}</TableCell>
                  <TableCell>
                    <Typography color="secondary.main" fontWeight="bold">
                      ${item.costo}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.observaciones}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default MaintenanceTable;

