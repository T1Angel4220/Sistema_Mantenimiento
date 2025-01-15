import React, { useEffect, useState } from "react";
import axios from 'axios';

import {
  Modal,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Typography,
  Grid,
  Pagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { es } from 'date-fns/locale';
import EquiposModal from './BuscarEquipos';

import { Calendar, Home, ShoppingCart, PenTool, FileText, LogOut } from 'lucide-react';
import { format } from 'date-fns';

import DatePicker from 'react-datepicker';
import EdicionEquipo from './EdicionEquipoMantenimientoModal';
import { FormControl } from "@mui/material";

const ModalEdicionMantenimiento = ({ mantenimiento, open, onClose, guardar, seleccionarEquipo, guardarEditar, handleAniadirEquipos }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [ActividadOComponente, setActividadOComp] = useState(false);
  const [Estado, SetEstado] = useState(null);
  const [mantenimientoSe, setMantenimiento] = useState(false);
  const [page, setPage] = useState(1); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Equipos por página
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({
    actividades: [],
    componentes: [],
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [fechaFin, setFechaFin] = useState(null);


  const handleCancel = () => {
    setOpenConfirmDialog(false);
  };
  const handleConfirmSave = () => {

    console.log(mantenimiento)
    const EstadoFin = Estado ?? mantenimiento.estado;
    const mantenimientoGu = {
      ...mantenimiento,
      fecha_fin: fechaFin ?? mantenimiento.fecha_fin,
      estado: EstadoFin
    };
    console.log(mantenimientoGu)
    try {
      axios.put(`http://localhost:8000/api/mantenimientosDetalles`,
        mantenimientoGu)
        .then(response => {
          console.log('Mantenimiento actualizado exitosamente:', response.data);
          guardarEditar();

        })
        .catch(error => {
          console.error('Error al actualizar mantenimiento:', error);
        });


    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    };
    onClose();
    setOpenConfirmDialog(false);

  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const openBuscarEquipo = () => {
    setOpenModal(true);

  };
  const cerrarBuscarEquipo = () => {
    setOpenModal(false);

  };
  const handleAddEquipos = (equipos) => {
    handleAniadirEquipos(equipos)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setMantenimiento(mantenimiento);
  }, [mantenimiento]);

  useEffect(() => {
    setFechaFin(mantenimiento?.fecha_fin);
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEquipoSeleccionado(null);
  };
  const handleOpenModal = (equipo) => {
    seleccionarEquipo(equipo);
    const equipoConPropiedades = {
      ...equipo,
      actividades: equipo.actividades || [],
      componentes: equipo.componentes || [],
    };

    setEquipoSeleccionado(equipoConPropiedades);
    console.log(equipoConPropiedades);
    setModalOpen(true);
  };

  const handleSaveEditionEquip = (actividades, componentes, observacion) => {

    guardar(actividades, componentes, observacion, fechaFin);
  };

  if (mantenimiento == null)
    return




  const handleSave = () => {
    for (const equipo of mantenimiento.equipos) {
      console.log(equipo)
      if (equipo.componentes.length == 0 && equipo.actividades.length == 0) {
        setActividadOComp(true);
        setTimeout(() => {
          setActividadOComp(false);
        }, 3000)
        return;
      }
    }
    setOpenConfirmDialog(true);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >

        <Typography variant="h6" gutterBottom>
          Edición de Mantenimiento
        </Typography>
        <div className="h-8"></div>

        <Grid item xs={6}>
          {ActividadOComponente && (
            <Modal
              open={true}
              onClose={() => { }}
            >
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl max-w-lg w-full text-center">
                  <h1 className="text-xl font-bold">
                    El equipo debe tener una actividad o un componente guardado
                  </h1>
                </div>
              </div>
            </Modal>
          )}


          <TextField
            label="Codigo mantenimento"
            value={
              mantenimiento.codigo_mantenimiento || ''
            }
            fullWidth
            disabled
          />
        </Grid>
        <div className="h-2"></div>

        <Grid item xs={6}>
          <TextField
            label="Tipo"
            value={mantenimiento.tipo || ''}
            fullWidth
            disabled
          />
          <div className="h-2"></div>
          <Grid container spacing={2}>


            {/* ComboBox para el estado */}
            <Grid item xs={12} sm={6} md={4}>

              <TextField
                fullWidth
                value={Estado == null ? mantenimiento.estado : Estado}
                label="Estado"
                select
                onChange={(e) => SetEstado(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              >
                <MenuItem value="Terminado">Terminado</MenuItem>
                <MenuItem value="No terminado">No terminado</MenuItem>
              </TextField>

            </Grid>
          </Grid>

        </Grid>
        <div className="h-2"></div>
        <Grid container spacing={2}>
          {mantenimiento.tipo === 'Interno' ? (
            <>

            </>
          ) : (
            <>
              {/* Toda la información para mantenimiento externo */}

              <Grid item xs={6}>
                <TextField
                  label="Proveedor"
                  value={mantenimiento.proveedor || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Contacto Proveedor"
                  value={
                    mantenimiento.contacto_proveedor || ''
                  }
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Costo"
                  value={mantenimiento.costo || ''}
                  fullWidth
                  disabled
                />
              </Grid>




            </>
          )}
        </Grid>
        <div className="h-8"></div>
        <Grid container spacing={2} alignItems="center">
          {/* Fecha de Inicio */}
          <Grid item xs={6}>
            <TextField
              label="Fecha de Inicio"
              value={new Date(mantenimiento.fecha_inicio)
                .toISOString()
                .split('T')[0]
                .replace(/-/g, '/') }
              fullWidth
              disabled
            />
          </Grid>

          {/* Fecha Final */}
          <Grid item xs={6} className="mb-8">
            <div>
              <Typography variant="h10" gutterBottom className="mb-4">
                Fecha Final
              </Typography>
              <DatePicker
                selected={mantenimiento.fecha_fin || fechaFin} // Valor inicial del DatePicker
                onChange={(date) => setFechaFin(date)} // Actualiza el estado
                locale={es}
                dateFormat="dd/MM/yyyy"
                minDate={
                  mantenimiento.fecha_inicio
                    ? new Date(new Date(mantenimiento.fecha_inicio).setDate(new Date(mantenimiento.fecha_inicio).getDate() + 1))
                    : undefined
                }
                customInput={
                  <button
                    type="button"
                    className="border border-black p-2 flex items-center text-black w-80">
                    <Calendar className="mr-2 h-4 w-4 text-black" />
                    {fechaFin
                      ? fechaFin
                      : mantenimiento.fecha_fin}
                  </button>
                }
              />

            </div>
          </Grid>
        </Grid>
        <div className="h-8"></div>
        <Button variant="contained" color="primary" onClick={openBuscarEquipo}>
          Añadir equipo
        </Button>
        <EquiposModal open={openModal} onClose={cerrarBuscarEquipo} onAddEquipo={handleAddEquipos} equiposSe={mantenimiento.equipos} fechaInicio={mantenimiento.fecha_inicio} fechaFin={mantenimiento.fecha_fin} />
        <div className="h-8"></div>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Nombre Producto
                </TableCell>
                <TableCell
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Código Barras
                </TableCell>
                <TableCell
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Tipo Equipo
                </TableCell>
                <TableCell
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Fecha Adquisición
                </TableCell>
                <TableCell
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Ubicación
                </TableCell>
                <TableCell
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Proceso Compra ID
                </TableCell>
                <TableCell
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mantenimiento.equipos
                .slice((page - 1) * rowsPerPage, (page) * rowsPerPage + 1).map((equipo) => (
                  <TableRow key={equipo.id}>
                    <TableCell>{equipo.Nombre_Producto}</TableCell>
                    <TableCell>{equipo.Codigo_Barras}</TableCell>
                    <TableCell>{equipo.Tipo_Equipo}</TableCell>
                    <TableCell>{equipo.Fecha_Adquisicion}</TableCell>
                    <TableCell>{equipo.Ubicacion_Equipo}</TableCell>
                    <TableCell>{equipo.proceso_compra_id}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" size="small" onClick={() => handleOpenModal(equipo)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(mantenimiento.equipos.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
        />
        <EdicionEquipo open={modalOpen} handleClose={handleCloseModal} equipo={equipoSeleccionado} actividadesSe={equipoSeleccionado == null ? [] : equipoSeleccionado.actividades} componentesSe={equipoSeleccionado == null ? [] : equipoSeleccionado.componentes} guardarActivComp={handleSaveEditionEquip} />


        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{
            mr: 2,
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkred'
            }
          }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </Box>
        <Dialog open={openConfirmDialog} onClose={handleCancel}>
          <DialogTitle>Confirmación</DialogTitle>
          <DialogContent>
            <h1>¿Esta seguro de guardar los cambios realizados?</h1>
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

      </Box>

    </Modal>
  );
};

export default ModalEdicionMantenimiento;
