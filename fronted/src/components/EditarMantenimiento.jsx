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
import DatePicker from 'react-datepicker';
import EdicionEquipo from './EdicionEquipoMantenimientoModal';

const ModalEdicionMantenimiento = ({ mantenimiento, open, onClose, guardar, seleccionarEquipo, guardarEditar }) => {
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setMantenimiento(mantenimiento);
  }, [mantenimiento]);

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

    guardar(actividades, componentes, observacion);
  };

  if (mantenimiento == null)
    return
  const handleFechaFinChange = (newValue) => {
    setFechaFin(newValue);
  };

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


        <Grid container spacing={2}>
          {mantenimiento.tipo === 'Interno' ? (
            <>
              {/* Solo fechas para mantenimiento interno */}
              <Grid item xs={6}>
                <TextField
                  label="Fecha de Inicio"
                  value={mantenimiento.fecha_inicio || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Fecha Final"
                  value={mantenimiento.fecha_fin || ''}
                  onChange={handleFechaFinChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </>
          ) : (
            <>
              {/* Toda la información para mantenimiento externo */}
              <Grid item xs={6}>
                <TextField
                  label="Nombre del Producto"
                  value={
                    mantenimiento.equipos?.[0]?.Nombre_Producto || ''
                  }
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Código de Barras"
                  value={mantenimiento.equipos?.[0]?.Codigo_Barras || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tipo de Equipo"
                  value={mantenimiento.equipos?.[0]?.Tipo_Equipo || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fecha de Adquisición"
                  value={
                    mantenimiento.equipos?.[0]?.Fecha_Adquisicion || ''
                  }
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Ubicación del Equipo"
                  value={mantenimiento.equipos?.[0]?.Ubicacion_Equipo || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Descripción del Equipo"
                  value={
                    mantenimiento.equipos?.[0]?.Descripcion_Equipo || ''
                  }
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Proceso de Compra"
                  value={mantenimiento.equipos?.[0]?.proceso_compra_id || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Código de Mantenimiento"
                  value={mantenimiento.codigo_mantenimiento || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fecha de Inicio"
                  value={mantenimiento.fecha_inicio || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Fecha Final"
                  value={mantenimiento.fecha_fin || ''}
                  onChange={handleFechaFinChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Proveedor"
                  value={mantenimiento.proveedor || 'N/A'}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Contacto del Proveedor"
                  value={mantenimiento.contacto_proveedor || 'N/A'}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Costo"
                  value={mantenimiento.costo || 'N/A'}
                  fullWidth
                  disabled
                />
              </Grid>
            </>
          )}
        </Grid>

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
