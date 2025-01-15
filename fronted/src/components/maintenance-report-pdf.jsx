'use client'

import { Document, Page, Text, View, StyleSheet, Svg, Path, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  section: {
    margin: 10,
    padding: 10
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30
  },
  tableHeader: {
    backgroundColor: '#f0f0f0'
  },
  tableCell: {
    flex: 1,
    padding: 5
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10
  },
  summaryItem: {
    width: '25%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10
  },
  equipmentSection: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  bold: {
    fontWeight: 'bold'
  },
  observationSection: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f5f5f5'
  },
  chartSection: {
    marginTop: 20,
    padding: 10,
    borderTop: 1,
    borderColor: '#ddd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15
  },
  barChart: {
    width: '100%',
    height: 400,
    marginBottom: 20,
    padding: '20px 40px'
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative'
  },
  bar: {
    height: 40,
    marginLeft: 10,
    borderRadius: 4
  },
  barLabel: {
    width: 150,
    fontSize: 10
  },
  barValue: {
    marginLeft: 5,
    fontSize: 10
  },
  donutChart: {
    width: '100%',
    height: 400,
    position: 'relative',
    marginTop: 20
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 5
  },
  legendText: {
    fontSize: 10
  },
  chart: {
    width: '100%',
    maxWidth: 500,
    height: 'auto',
    marginVertical: 10
  }
})

const BAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9B5DE5', '#00BBF9'
];

const DONUT_COLORS = {
  equipos: '#2196F3',    // azul
  actividades: '#00E676', // verde
  componentes: '#FFB74D', // amarillo
  dias: '#FF7043'        // naranja
};

export function MaintenanceReportPDF({ data, chartImages }) {
  if (!data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No hay datos disponibles</Text>
        </Page>
      </Document>
    )
  }

  const totalEquipos = data.equipos?.length || 0
  const totalActividades = data.equipos?.reduce(
    (sum, equipo) => sum + (equipo.actividades?.length || 0),
    0
  ) || 0
  const totalComponentes = data.equipos?.reduce(
    (sum, equipo) => sum + (equipo.componentes?.length || 0),
    0
  ) || 0
  const duracion = Math.ceil(
    (new Date(data.fecha_fin).getTime() - new Date(data.fecha_inicio).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  // Calculate max values for scaling
  const maxActividades = Math.max(...(data.equipos?.map(e => e.actividades?.length || 0) || [1]))
  const maxComponentes = Math.max(...(data.equipos?.map(e => e.componentes?.length || 0) || [1]))

  // Donut chart calculations
  const total = totalEquipos + totalActividades + totalComponentes + duracion
  const radius = 120;
  const centerX = 250;
  const centerY = 200;
  const strokeWidth = 60;

  const createDonutSegment = (startPercent, endPercent, color) => {
    const start = startPercent * Math.PI * 2
    const end = endPercent * Math.PI * 2
    
    const x1 = centerX + radius * Math.cos(start)
    const y1 = centerY + radius * Math.sin(start)
    const x2 = centerX + radius * Math.cos(end)
    const y2 = centerY + radius * Math.sin(end)
    
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0
    
    return `M ${centerX + radius * Math.cos(start)} ${centerY + radius * Math.sin(start)} 
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${centerX + radius * Math.cos(end)} ${centerY + radius * Math.sin(end)}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SISTEMA DE MANTENIMIENTOS SK TELECOM</Text>
        </View>

        {/* Main Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN GENERAL</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Campo</Text>
              <Text style={styles.tableCell}>Valor</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>CODIGO MANTENIMIENTO</Text>
              <Text style={styles.tableCell}>{data.codigo_mantenimiento || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>FECHA INICIO</Text>
              <Text style={styles.tableCell}>{data.fecha_inicio || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>FECHA FIN</Text>
              <Text style={styles.tableCell}>{data.fecha_fin || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>TIPO</Text>
              <Text style={styles.tableCell}>{data.tipo || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>RESPONSABLE</Text>
              <Text style={styles.tableCell}>
                {`${data.nombre_responsable || ''} ${data.apellido_responsable || ''}`.trim() || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESUMEN GENERAL</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.text}>Total de Equipos</Text>
              <Text style={[styles.text, styles.bold]}>{totalEquipos}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.text}>Total de Actividades</Text>
              <Text style={[styles.text, styles.bold]}>{totalActividades}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.text}>Total de Componentes</Text>
              <Text style={[styles.text, styles.bold]}>{totalComponentes}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.text}>Duración</Text>
              <Text style={[styles.text, styles.bold]}>{duracion} días</Text>
            </View>
          </View>
        </View>

        {/* Equipment Details with Observations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLE DE EQUIPOS</Text>
          {data.equipos?.map((equipo, index) => (
            <View key={index} style={styles.equipmentSection}>
              <Text style={[styles.text, styles.bold]}>
                {equipo.Nombre_Producto || 'Equipo sin nombre'}
              </Text>
              
              <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>Actividades:</Text>
              {equipo.actividades?.map((actividad, idx) => (
                <Text key={idx} style={styles.text}>• {actividad.nombre}</Text>
              )) || <Text style={styles.text}>No hay actividades registradas</Text>}

              <Text style={[styles.text, styles.bold, { marginTop: 10 }]}>Componentes:</Text>
              {equipo.componentes?.map((componente, idx) => (
                <Text key={idx} style={styles.text}>
                  • {componente.nombre} - Cantidad: {componente.cantidad || 'N/A'}
                </Text>
              )) || <Text style={styles.text}>No hay componentes registrados</Text>}

              {/* Observations Section */}
              <View style={styles.observationSection}>
                <Text style={[styles.text, styles.bold]}>Observaciones:</Text>
                <Text style={styles.text}>
                  {equipo.observacion || 'No hay observaciones registradas'}
                </Text>
              </View>
            </View>
          ))}
        </View>
        // In the Statistical Charts Section
<View style={styles.section} break>
  <Text style={styles.sectionTitle}>ESTADÍSTICAS</Text>
  
  {/* Actividades Chart */}
  <View style={styles.chartSection}>
    <Text style={styles.chartTitle}>Actividades por Equipo</Text>
    {chartImages?.actividades ? (
      <Image
        src={chartImages.actividades || "/placeholder.svg"}
        style={{
          width: 500,
          height: 300,
          objectFit: 'contain'
        }}
      />
    ) : (
      <Text style={styles.text}>No se pudo generar el gráfico de actividades</Text>
    )}
  </View>
  
  {/* Componentes Chart */}
  <View style={styles.chartSection}>
    <Text style={styles.chartTitle}>Componentes por Equipo</Text>
    {chartImages?.componentes ? (
      <Image
        src={chartImages.componentes || "/placeholder.svg"}
        style={{
          width: 500,
          height: 300,
          objectFit: 'contain'
        }}
      />
    ) : (
      <Text style={styles.text}>No se pudo generar el gráfico de componentes</Text>
    )}
  </View>
  
  {/* Resumen Chart */}
  <View style={styles.chartSection}>
    <Text style={styles.chartTitle}>Resumen General</Text>
    {chartImages?.resumen ? (
      <Image
        src={chartImages.resumen || "/placeholder.svg"}
        style={{
          width: 500,
          height: 300,
          objectFit: 'contain'
        }}
      />
    ) : (
      <Text style={styles.text}>No se pudo generar el gráfico de resumen</Text>
    )}
  </View>
</View>

      </Page>
    </Document>
  )
}

