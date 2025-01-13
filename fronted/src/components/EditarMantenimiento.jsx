import React, { useEffect, useState } from "react";
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
  TablePagination,
  TextField
} from "@mui/material";
import { es } from 'date-fns/locale';
import EquiposModal from './BuscarEquipos';

import { Calendar, Home, ShoppingCart, PenTool, FileText, LogOut } from 'lucide-react';
import { format } from 'date-fns';

import DatePicker from 'react-datepicker';
import EdicionEquipo from './EdicionEquipoMantenimientoModal';

const ModalEdicionMantenimiento = ({ mantenimiento, open, onClose, guardar, seleccionarEquipo, guardarEditar, handleAniadirEquipos }) => {
  const [modalOpen, setModalOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
  
  const [mantenimientoSe, setMantenimiento] = useState(false);
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(8); // Equipos por página
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({
    actividades: [],
    componentes: [],
  });
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

  const [fechaFin, setFechaFin] = useState(null);
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
    guardarEditar()
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >

        <Typography variant="h6" gutterBottom>
          Edición de Mantenimiento
        </Typography>
        <div className="h-8"></div>

        <Grid item xs={6}>
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
              value={mantenimiento.fecha_inicio || ''}
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
                onChange={(date) => {
                  setFechaFin(date); // Actualiza el estado fechaFin al cambiar la fecha
                }}
                locale={es}
                dateFormat="dd/MM/yyyy"
                minDate={mantenimiento.fecha_inicio}
                customInput={
                  <button
                    type="button"
                    className="border border-black p-2 flex items-center text-black w-80 ">
                    <Calendar className="mr-2 h-4 w-4 text-black" />
                    {fechaFin ? format(fechaFin, 'dd/MM/yyyy') : format(mantenimiento.fecha_fin, 'dd/MM/yyyy')}
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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((equipo) => (
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
        <TablePagination
          rowsPerPageOptions={[8]}
          component="div"
          count={mantenimiento.equipos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <EdicionEquipo open={modalOpen} handleClose={handleCloseModal} equipo={equipoSeleccionado} actividadesSe={equipoSeleccionado == null ? [] : equipoSeleccionado.actividades} componentesSe={equipoSeleccionado == null ? [] : equipoSeleccionado.componentes} guardarActivComp={handleSaveEditionEquip} />


        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalEdicionMantenimiento;
