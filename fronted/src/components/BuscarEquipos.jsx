import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    Pagination,
    TextField,
    Checkbox,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const EquiposModal = ({ open, onClose, onAddEquipo, equiposSe, fechaInicio, fechaFin }) => {
    const [equipos, setEquipos] = useState([]);
    const [filters, setFilters] = useState({
        nombre_producto: '',
        codigo_barras: '',
        tipo_equipo: '',
        fecha_adquisicion_inicio: '',
        fecha_adquisicion_fin: '',
        ubicacion_equipo: '',
    });

    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedEquipos, setSelectedEquipos] = useState([]);

    useEffect(() => {
        const fetchEquiposDis = async () => {
            try {
                const ids = equiposSe.map((equipo) => equipo.id);
                const requestData = {
                    fecha_inicio: new Date(fechaInicio).toISOString().split("T")[0],
                    fecha_fin: new Date(fechaFin).toISOString().split("T")[0],
                    excluir_equipos: ids, // IDs de equipos a excluir (opcional)
                };
                console.log(requestData)
                // Realizar la solicitud al endpoint
                const response = await axios.post(
                    'http://localhost:8000/api/equipoDisponibles',
                    requestData
                );

                // Actualizar el estado con los equipos obtenidos
                setFilteredData(response.data);
            } catch (err) {
                console.error("Error al obtener los equipos:", err);
            } finally {

            }
        };

        fetchEquiposDis();
    }, [equiposSe]);



    const handleSelectAll = () => {
        setSelectedEquipos(filteredData.map((equipo) => equipo.id));
    };

    const handleSelectEquipo = (id) => {
        setSelectedEquipos((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((equipoId) => equipoId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSaveEquipos = () => {
        setOpenConfirmDialog(true);  // Abrimos el diálogo de confirmación
    };

    const handleConfirmSave = () => {
        const equiposToSave = filteredData.filter((equipo) => selectedEquipos.includes(equipo.id));
        console.log(selectedEquipos)
        onAddEquipo(equiposToSave); // Llamamos a la función de agregar los equipos
        setConfirmationMessage('¿Esta seguro de que quiere añadir estos equipo?');
        setOpenConfirmDialog(false);
        onClose();  // Cerramos el modal
    };

    const handleCancel = () => {
        setOpenConfirmDialog(false);
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const handleSearch = async () => {

        try {
            const ids = equiposSe.map((equipo) => equipo.id);
            const requestData = {
                ...filters,
                fecha_inicio: new Date(fechaInicio).toISOString().split("T")[0],
                fecha_fin: new Date(fechaFin).toISOString().split("T")[0],
                excluir_equipos: ids,
            };
            console.log(requestData)
            const response = await axios.post('http://localhost:8000/api/equiposDisponiblesFiltros', requestData);
            setFilteredData(response.data);
            setPage(1);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const startIndex = (page - 1) * rowsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <Grid container alignItems="center" justifyContent="space-between">
                    <span>Buscar Equipos</span>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            '&:hover': { backgroundColor: '#d32f2f' },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {/* Filtros */}
                <div className="h-8"></div>
                <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Nombre Producto"
                            variant="outlined"
                            value={filters.nombre_producto}
                            onChange={(e) => handleFilterChange('nombre_producto', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Código de Barras"
                            variant="outlined"
                            value={filters.codigo_barras}
                            onChange={(e) => handleFilterChange('codigo_barras', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Tipo de Equipo"
                            select
                            value={filters.tipo_equipo}
                            onChange={(e) => handleFilterChange('tipo_equipo', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        >
                            <MenuItem value="Informático">Informático</MenuItem>
                            <MenuItem value="Electrónicos y Eléctricos">Electrónicos y Eléctricos</MenuItem>
                            <MenuItem  value="Industriales">Industriales</MenuItem>
                            <MenuItem value="Audiovisuales">Audiovisuales</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Fecha Adquisición Inicio"
                            type="date"
                            variant="outlined"
                            value={filters.fecha_adquisicion_inicio}
                            onChange={(e) => handleFilterChange('fecha_adquisicion_inicio', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Fecha Adquisición Fin"
                            type="date"
                            variant="outlined"
                            value={filters.fecha_adquisicion_Fin}
                            onChange={(e) => handleFilterChange('fecha_adquisicion_fin', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Ubicación Equipo"
                            select
                            value={filters.ubicacion_equipo}
                            onChange={(e) => handleFilterChange('ubicacion_equipo', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        >
                            <MenuItem value="Departamento de TI">Departamento de TI</MenuItem>
                            <MenuItem value="Laboratorio de Redes">Laboratorio de Redes</MenuItem>
                            <MenuItem value="Sala de reuniones">Sala de reuniones</MenuItem>
                            < MenuItem value="Laboratorio CTT">Laboratorio CTT</MenuItem>
                        </TextField>
                    </Grid>

                </Grid>

                {/* Botón Buscar */}
                <Grid container justifyContent="flex-end" sx={{ marginBottom: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        Buscar
                    </Button>
                </Grid>

                {/* Botón Seleccionar Todos */}
                <Grid container justifyContent="flex-end" sx={{ marginBottom: 2 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSelectAll}
                    >
                        Seleccionar Todos
                    </Button>
                </Grid>

                {/* Tabla */}
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Nombre Producto</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Código de Barras</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Tipo de Equipo</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Fecha de Adquisición</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Ubicación</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Descripción</TableCell>
                                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Agregar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    sx={{
                                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <TableCell>{item.Nombre_Producto}</TableCell>
                                    <TableCell>{item.Codigo_Barras}</TableCell>
                                    <TableCell>{item.Tipo_Equipo}</TableCell>
                                    <TableCell>{item.Fecha_Adquisicion}</TableCell>
                                    <TableCell>{item.Ubicacion_Equipo}</TableCell>
                                    <TableCell>{item.Descripcion_Equipo}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedEquipos.includes(item.id)}
                                            onChange={() => handleSelectEquipo(item.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                <Pagination
                    count={Math.ceil(filteredData.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'darkred'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSaveEquipos}
                    sx={{
                        backgroundColor: '#3b82f6', // Azul más bajo
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#2563eb' // Tono de azul más oscuro al pasar el cursor
                        }
                    }}
                >
                    Guardar Equipos
                </Button>
            </DialogActions>

            {/* Confirmación de Guardado */}
            <Dialog open={openConfirmDialog} onClose={handleCancel}>
                <DialogTitle>Confirmación</DialogTitle>
                <DialogContent>
                    <h1>¿Esta seguro de que quiere añadir estos equipos?</h1>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="secondary"
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
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default EquiposModal;
