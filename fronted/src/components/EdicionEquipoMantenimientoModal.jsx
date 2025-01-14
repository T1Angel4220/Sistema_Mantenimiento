import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Tabs, Tab, Box, Grid, TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useEffect } from 'react';
import axios from 'axios';
const EdicionEquipo = ({ open, handleClose, equipo, actividadesSe, componentesSe, guardarActivComp }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [observacion, setObservacion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [actividadSeleccionada, setActividadSeleccionada] = useState('');
    const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
    const [componenteSeleccionado, setComponenteSeleccionado] = useState('');
    const [componentesSeleccionados, setComponentesSeleccionados] = useState([]);
    const [pageActividades, setPageActividades] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pageComponentes, setPageComponentes] = useState(1);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [actividades, setActividades] = useState([]);
    const [componentes, setComponentes] = useState([]);
    const [ActividadOComponente, setActividadOComp] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesResponse, componentsResponse] = await Promise.all([
                    axios.get('http://localhost:8000/api/actividades'),
                    axios.get('http://localhost:8000/api/componentes'),
                ]);

                setActividades(activitiesResponse.data);
                setComponentes(componentsResponse.data);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    const handleConfirmSave = () => {
        setOpenConfirmDialog(false)
        guardarActivComp(actividadesSeleccionadas, componentesSeleccionados, observacion);
        handleClose();

    };

    const handleSave = () => {
        if (componentesSeleccionados.length == 0 && actividadesSeleccionadas.length == 0) {
            setActividadOComp(true);
            setTimeout(() => {
                setActividadOComp(false);
            }, 3000)
            return;
        }
        setOpenConfirmDialog(true);
    };

    const handleCancel = () => {
        setObservacion('');
        handleClose();
    };
    useEffect(() => {
        // Filtrar los equipos seleccionados a partir de sus ids
        setActividadesSeleccionadas(actividadesSe);
        // Extraer todas las actividades de los equipos seleccionados
        setComponentesSeleccionados(componentesSe);

        setObservacion(equipo == null ? "" : equipo.observacion);
    }, [actividadesSe, componentesSe]);

    const handleAgregarActividad = () => {
        if (actividadSeleccionada) {
            const actividad = actividades.find((actividad) => actividad.id == actividadSeleccionada);
            // Verifica si ya está seleccionada
            if (!actividadesSeleccionadas.some((a) => a.id == actividad.id)) {
                setActividadesSeleccionadas([ actividad,...actividadesSeleccionadas]);
            }
            setActividadSeleccionada('');
        }
    };

    const handleAgregarComponente = () => {
        if (componenteSeleccionado) {
            const componente = componentes.find((componente) => componente.id === componenteSeleccionado);
            // Verifica si ya está seleccionado
            if (!componentesSeleccionados.some((c) => c.id === componente.id)) {
                setComponentesSeleccionados([...componentesSeleccionados, componente]);
            }
            setComponenteSeleccionado('');
        }
    };


    const handleChangePageActividades = (event, newPage) => {
        setPageActividades(newPage);
    };

    const handleChangePageComponentes = (event, newPage) => {
        setPageComponentes(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageActividades(0);
    };
    const [confirmarEliminar, setConfirmarEliminar] = useState({ abierto: false, tipo: '', item: null });

    const handleEliminar = (tipo, item) => {
        setConfirmarEliminar({ abierto: true, tipo, item });
    };
    const handleConfirmCancel = () => {
        setOpenConfirmDialog(false);
    };

    const confirmarEliminacion = () => {
        const { tipo, item } = confirmarEliminar;
        if (tipo === 'actividad') {
            setActividadesSeleccionadas((prev) => prev.filter((act) => act.id !== item.id));
        } else if (tipo === 'componente') {
            setComponentesSeleccionados((prev) => prev.filter((comp) => comp.id !== item.id));
        }
        setConfirmarEliminar({ abierto: false, tipo: '', item: null });
    };

    return (

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            {ActividadOComponente && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                        <h1 className="text-xl font-bold">El equipo debe tener una actividad o un componente guardado</h1>
                    </div>
                </div>
            )}
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                Editar Equipo
            </DialogTitle>
            <DialogContent sx={{ mt: 2, p: 0 }}>
                {equipo == null ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Tabs value={tabIndex} onChange={handleTabChange} centered>
                            <Tab icon={<BuildIcon />} label="Información" />
                            <Tab icon={<ListAltIcon />} label="Actividades" />
                            <Tab icon={<EngineeringIcon />} label="Componentes" />
                        </Tabs>

                        {tabIndex === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Nombre del Producto"
                                            value={equipo.Nombre_Producto || ''}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Código de Barras"
                                            value={equipo.Codigo_Barras || ''}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Tipo de Equipo"
                                            value={equipo.Tipo_Equipo || ''}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Fecha de Adquisición"
                                            value={equipo.Fecha_Adquisicion || ''}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Ubicación del Equipo"
                                            value={equipo.Ubicacion_Equipo || ''}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Descripción del Equipo"
                                            value={equipo.Descripcion_Equipo || ''}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Proceso de Compra"
                                            value={equipo.proceso_compra_id || ''}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    label="Observación"
                                    value={observacion}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    onChange={(e) => setObservacion(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        )}


                        {tabIndex === 1 && (
                            <Box sx={{ p: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Seleccionar Actividad</InputLabel>
                                    <Select

                                        onChange={(e) => setActividadSeleccionada(e.target.value)}
                                    >
                                        {actividades.map((actividad) => (
                                            <MenuItem key={actividad.id} value={actividad.id}>
                                                {actividad.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={handleAgregarActividad}
                                >
                                    Agregar Actividad
                                </Button>

                                <TableContainer component={Paper} sx={{ mt: 3 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {actividadesSeleccionadas.slice((pageActividades-1) * rowsPerPage,(pageActividades)* rowsPerPage+1)
                                                .map((actividad) => (
                                                    <TableRow key={actividad.id}>
                                                        <TableCell>{actividad.id}</TableCell>
                                                        <TableCell>{actividad.nombre}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                color="secondary"
                                                                onClick={() => handleEliminar('actividad', actividad)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Pagination
                                    count={Math.ceil(actividadesSeleccionadas.length / rowsPerPage)}
                                    page={pageActividades}
                                    onChange={handleChangePageActividades}
                                    sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                                />
                            </Box>
                        )}

                        {tabIndex === 2 && (
                            <Box sx={{ p: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Seleccionar Componente</InputLabel>
                                    <Select
                                        value={componenteSeleccionado}
                                        onChange={(e) => setComponenteSeleccionado(e.target.value)}
                                    >
                                        {componentes.map((componente) => (
                                            <MenuItem key={componente.id} value={componente.id}>
                                                {componente.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="primary"


                                    onClick={handleAgregarComponente}

                                >
                                    Agregar Componente
                                </Button>

                                <TableContainer component={Paper} sx={{ mt: 3 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {componentesSeleccionados.slice((pageComponentes-1) * rowsPerPage,(pageComponentes)* rowsPerPage+1).map((componente) => (
                                                <TableRow key={componente.id}>
                                                    <TableCell>{componente.id}</TableCell>
                                                    <TableCell>{componente.nombre}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            color="secondary"
                                                            onClick={() => handleEliminar('componente', componente)}
                                                            sx={{
                                                                backgroundColor: 'red',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    backgroundColor: 'darkred'
                                                                }
                                                            }}
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Pagination
                                    count={Math.ceil(componentesSeleccionados.length / rowsPerPage)}
                                    page={pageComponentes}
                                    onChange={handleChangePageComponentes}
                                    sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                                />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 3 }}>
                            <Button variant="outlined" color="secondary" onClick={handleCancel}
                                sx={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'darkred'
                                    }
                                }}>
                                Cancelar
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Guardar
                            </Button>
                        </Box>
                    </>
                )}
            </DialogContent>
            <Dialog open={confirmarEliminar.abierto} onClose={() => setConfirmarEliminar({ abierto: false, tipo: '', item: null })}>
                <DialogContent>
                    ¿Está seguro de que desea eliminar esta {confirmarEliminar.tipo === 'actividad' ? 'actividad' : 'componente'}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmarEliminar({ abierto: false, tipo: '', item: null })}>Cancelar</Button>
                    <Button color="secondary" onClick={confirmarEliminacion}>Eliminar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openConfirmDialog} onClose={handleCancel}>
                <DialogTitle>Confirmación</DialogTitle>
                <DialogContent>
                    <h1>¿Esta seguro de guardar los cambios del equipo?</h1>
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
        </Dialog>
    );
};

export default EdicionEquipo;
