'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

export default function HiddenCharts({ 
  selectedReport, 
  actividadesChartRef, 
  componentesChartRef, 
  resumenChartRef,
  COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
  BAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']
}) {
  // Safely prepare data with null checks
  const equipos = selectedReport?.equipos || [];
  
  const actividadesData = equipos.map((equipo, index) => ({
    name: equipo?.Nombre_Producto || `Equipo ${index + 1}`,
    actividades: equipo?.actividades?.length || 0
  }));

  const componentesData = equipos.map((equipo, index) => ({
    name: equipo?.Nombre_Producto || `Equipo ${index + 1}`,
    componentes: equipo?.componentes?.length || 0
  }));

  const resumenData = [
    {
      name: 'Equipos',
      value: equipos.length,
      label: `Total de Equipos: ${equipos.length}`
    },
    {
      name: 'Actividades',
      value: equipos.reduce((total, equipo) => 
        total + (equipo?.actividades?.length || 0), 0),
      label: `Total de Actividades: ${equipos.reduce((total, equipo) => 
        total + (equipo?.actividades?.length || 0), 0)}`
    },
    {
      name: 'Componentes',
      value: equipos.reduce((total, equipo) => 
        total + (equipo?.componentes?.length || 0), 0),
      label: `Total de Componentes: ${equipos.reduce((total, equipo) => 
        total + (equipo?.componentes?.length || 0), 0)}`
    },
    {
      name: 'Días',
      value: selectedReport?.fecha_fin && selectedReport?.fecha_inicio ? 
        Math.ceil((new Date(selectedReport.fecha_fin) - new Date(selectedReport.fecha_inicio)) / (1000 * 60 * 60 * 24)) : 0,
      label: `Duración: ${selectedReport?.fecha_fin && selectedReport?.fecha_inicio ? 
        Math.ceil((new Date(selectedReport.fecha_fin) - new Date(selectedReport.fecha_inicio)) / (1000 * 60 * 60 * 24)) : 0} días`
    }
  ];

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      {/* Actividades Chart */}
      <div
        ref={actividadesChartRef}
        id="actividadesChart"
        style={{
          width: '900px',
          height: '500px',
          backgroundColor: 'white',
          padding: '20px'
        }}
      >
        <BarChart
          width={900}
          height={500}
          data={actividadesData}
          margin={{ top: 30, right: 40, left: 40, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            height={120}
            interval={0}
            tick={{
              fontSize: 12,
              fill: '#666',
              fontFamily: 'Arial'
            }}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 12,
              fill: '#666',
              fontFamily: 'Arial'
            }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="actividades" name="Número de Actividades" radius={[4, 4, 0, 0]} barSize={50}>
            {actividadesData.map((entry, index) => (
              <Cell key={`cell-actividades-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </div>

      {/* Componentes Chart */}
      <div
        ref={componentesChartRef}
        id="componentesChart"
        style={{
          width: '900px',
          height: '500px',
          backgroundColor: 'white',
          padding: '20px'
        }}
      >
        <BarChart
          width={900}
          height={500}
          data={componentesData}
          margin={{ top: 30, right: 40, left: 40, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            height={120}
            interval={0}
            tick={{
              fontSize: 12,
              fill: '#666',
              fontFamily: 'Arial'
            }}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 12,
              fill: '#666',
              fontFamily: 'Arial'
            }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="componentes" name="Número de Componentes" radius={[4, 4, 0, 0]} barSize={50}>
            {componentesData.map((entry, index) => (
              <Cell key={`cell-componentes-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </div>

      {/* Resumen Chart */}
      <div
        ref={resumenChartRef}
        id="resumenChart"
        style={{
          width: '800px',
          height: '500px',
          backgroundColor: 'white',
          padding: '20px'
        }}
      >
        <PieChart width={800} height={500}>
          <Pie
            data={resumenData}
            cx={400}
            cy={250}
            innerRadius={100}
            outerRadius={160}
            paddingAngle={5}
            dataKey="value"
            labelLine={true}
            label={({ label }) => label}
          >
            {resumenData.map((entry, index) => (
              <Cell
                key={`cell-resumen-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  )
}

