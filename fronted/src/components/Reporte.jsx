import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const ReportesMantenimiento = () => {
  const [fechaRango, setFechaRango] = useState([null, null]);
  const [mantenimiento, setMantenimiento] = useState('');
  const [equipo, setEquipo] = useState('');
  const [tipoActivo, setTipoActivo] = useState('');
  const [actividad, setActividad] = useState('');
  const [componente, setComponente] = useState('');
  const [estado, setEstado] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);

  const [mantenimientosLista, setMantenimientosLista] = useState([]);
  const [equiposLista, setEquiposLista] = useState([]);
  const [actividadesLista, setActividadesLista] = useState([]);
  const [componentesLista, setComponentesLista] = useState([]);

  // Cargar datos iniciales y lista de mantenimientos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [mantenimientosResponse, equiposResponse, actividadesResponse, componentesResponse, datosResponse] = 
          await Promise.all([
            axios.get('http://localhost:8000/api/lista-mantenimientos'),
            axios.get('http://localhost:8000/api/equipos-mantenimiento'),
            axios.get('http://localhost:8000/api/actividades'),
            axios.get('http://localhost:8000/api/componentes'),
            axios.get('http://localhost:8000/api/mantenimientos') // Cargar datos iniciales
          ]);

        setMantenimientosLista(mantenimientosResponse.data);
        setEquiposLista(equiposResponse.data);
        setActividadesLista(actividadesResponse.data);
        setComponentesLista(componentesResponse.data);
        setResultados(datosResponse.data); // Establecer datos iniciales
        setError(null);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchMantenimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct the params object with all filters
      const params = {
        fechaInicio: fechaRango[0] ? fechaRango[0].toISOString().split('T')[0] : null,
        fechaFin: fechaRango[1] ? fechaRango[1].toISOString().split('T')[0] : null,
        tipo: mantenimiento || null,
        estado: estado || null,
        equipo: equipo || null,
        actividad: actividad || null,
        tipoActivo: tipoActivo || null,
        componente: componente || null
      };

      // Remove null values from params
      Object.keys(params).forEach(key => params[key] === null && delete params[key]);

      // If we have a date range, ensure we're searching for maintenance records that:
      // - Start within the range
      // - End within the range
      // - Span across the range
      if (params.fechaInicio && params.fechaFin) {
        const response = await axios.get('http://localhost:8000/api/mantenimientos', {
          params: {
            ...params,
            includeOverlapping: true // Add this flag to tell backend to include overlapping records
          }
        });
        setResultados(response.data);
      } else {
        // If no date range, proceed with normal filtering
        const response = await axios.get('http://localhost:8000/api/mantenimientos', { params });
        setResultados(response.data);
      }
    } catch (error) {
      console.error('Error al buscar mantenimientos:', error);
      setError('Error al buscar mantenimientos. Por favor, intente nuevamente.');
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    // Clear all filter states
    setFechaRango([null, null]);
    setMantenimiento('');
    setEquipo('');
    setTipoActivo('');
    setActividad('');
    setComponente('');
    setEstado('');
    
    // Close the modal
    setModalOpen(false);
    setSelectedReport(null);
    
    // Fetch all maintenance records immediately
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/mantenimientos');
      setResultados(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar mantenimientos:', error);
      setError('Error al cargar los mantenimientos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (report) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/mantenimientoDetalles/${report.id}`);
      setSelectedReport(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      setError('No se pudieron cargar los detalles del mantenimiento. Por favor, intente de nuevo.');
    }
  };

  useEffect(() => {
    fetchMantenimientos();
  }, [fechaRango, mantenimiento, equipo, tipoActivo, actividad, componente, estado]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sistema de Reportes de Mantenimiento</h1>

      {/* Filtros */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Filtros de Reporte</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {/* Rango de Fechas */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Rango de Fechas</label>
            <DatePicker
              selected={fechaRango[0]}
              onChange={(dates) => setFechaRango(dates)}
              startDate={fechaRango[0]}
              endDate={fechaRango[1]}
              selectsRange
              placeholderText="Seleccionar rango de fechas"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* Mantenimiento */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Mantenimiento</label>
            <select
              value={mantenimiento}
              onChange={(e) => setMantenimiento(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar mantenimiento</option>
              {mantenimientosLista.map((item) => (
                <option key={item.id} value={item.codigo_mantenimiento}>
                  {item.codigo_mantenimiento}
                </option>
              ))}
            </select>
          </div>

          {/* Equipo */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Equipo</label>
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar equipo</option>
              {equiposLista.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Mantenimiento */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Tipo de Mantenimiento</label>
            <select
              value={tipoActivo}
              onChange={(e) => setTipoActivo(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar tipo de activo</option>
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </select>
          </div>

          {/* Actividad */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Actividad</label>
            <select
              value={actividad}
              onChange={(e) => setActividad(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar actividad</option>
              {actividadesLista.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Componente */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Componente</label>
            <select
              value={componente}
              onChange={(e) => setComponente(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar componente</option>
              {componentesLista.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccionar estado</option>
              <option value="Terminado">Terminado</option>
              <option value="No terminado">No terminado</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={fetchMantenimientos}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Buscar
          </button>
          <button
            onClick={handleClearFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Borrar Filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Resultados del Reporte</h2>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <p>Cargando...</p>
        ) : resultados.length === 0 ? (
          <p>No se encontraron resultados</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Código</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Tipo</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Fecha Inicio</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Fecha Fin</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado) => (
                <tr 
                  key={resultado.id}
                  onClick={() => handleRowClick(resultado)}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    ':hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.id}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.codigo_mantenimiento}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.tipo}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.fecha_inicio}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.fecha_fin}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{resultado.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detalles del Mantenimiento */}
      {modalOpen && selectedReport && (
        <div 
          style={{
            marginTop: '20px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            padding: '20px',
          }}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Hoja de Vida del Reporte</h2>
              <button 
                onClick={() => setModalOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 5px'
                }}
              >
                ×
              </button>
            </div>

            {/* Información General del Mantenimiento */}
            <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '5px', border: '1px solid #ddd' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Información General</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <p><strong>Código:</strong> {selectedReport.codigo_mantenimiento}</p>
                <p><strong>Tipo:</strong> {selectedReport.tipo}</p>
                <p><strong>Fecha Inicio:</strong> {selectedReport.fecha_inicio}</p>
                <p><strong>Fecha Fin:</strong> {selectedReport.fecha_fin}</p>
                <p><strong>Estado:</strong> {selectedReport.estado}</p>
                {selectedReport.proveedor && <p><strong>Proveedor:</strong> {selectedReport.proveedor}</p>}
                {selectedReport.costo && <p><strong>Costo:</strong> ${selectedReport.costo}</p>}
              </div>
            </div>

            {/* Lista de Equipos */}
            {selectedReport.equipos && selectedReport.equipos.map((equipo, index) => (
              <div 
                key={equipo.id}
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff'
                }}
              >
                <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                  Equipo: {equipo.Nombre_Producto || 'No especificado'}
                </h3>

                {/* Actividades del Equipo */}
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>Actividades Realizadas</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {equipo.actividades && equipo.actividades.length > 0 ? (
                      equipo.actividades.map((actividad) => (
                        <li 
                          key={actividad.id}
                          style={{
                            marginBottom: '5px',
                            paddingLeft: '20px',
                            position: 'relative'
                          }}
                        >
                          <span style={{ position: 'absolute', left: '0', content: '"•"' }}>•</span>
                          {actividad.nombre}
                        </li>
                      ))
                    ) : (
                      <li>No hay actividades registradas</li>
                    )}
                  </ul>
                </div>

                {/* Componentes del Equipo */}
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>Componentes Utilizados</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {equipo.componentes && equipo.componentes.length > 0 ? (
                      equipo.componentes.map((componente) => (
                        <li 
                          key={componente.id}
                          style={{
                            marginBottom: '5px',
                            paddingLeft: '20px',
                            position: 'relative'
                          }}
                        >
                          <span style={{ position: 'absolute', left: '0', content: '"•"' }}>•</span>
                          {componente.nombre} - Cantidad: {componente.cantidad || 'No especificada'}
                        </li>
                      ))
                    ) : (
                      <li>No hay componentes registrados</li>
                    )}
                  </ul>
                </div>

                {/* Observaciones del Equipo */}
                <div>
                  <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>Observaciones</h4>
                  <p style={{ margin: 0, padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    {equipo.observacion || 'No hay observaciones registradas'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportesMantenimiento;

