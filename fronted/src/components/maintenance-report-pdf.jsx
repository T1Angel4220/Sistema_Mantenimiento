'use client'

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { BarChart, Bar, PieChart, Pie } from '@react-pdf/renderer-charts'

// Register fonts if needed
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto'
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
  logo: {
    width: 100,
    height: 50
  },
  section: {
    margin: 10,
    padding: 10
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10
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
    padding: 10
  },
  equipmentSection: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10
  }
})

/**
 * @typedef {Object} MaintenanceReportPDFProps
 * @property {Object} data - The maintenance report data
 * @property {string} data.codigo_mantenimiento - Maintenance code
 * @property {string} data.fecha_inicio - Start date
 * @property {string} data.fecha_fin - End date
 * @property {string} data.tipo - Type
 * @property {string} data.nombre_responsable - Responsible person's name
 * @property {string} data.apellido_responsable - Responsible person's last name
 * @property {Array<{
 *   Nombre_Producto: string,
 *   actividades: Array<{ nombre: string }>,
 *   componentes: Array<{ nombre: string, cantidad: number }>,
 *   observacion: string
 * }>} data.equipos - Equipment list
 */

export function MaintenanceReportPDF({ data }) {
  const totalEquipos = data.equipos.length
  const totalActividades = data.equipos.reduce(
    (sum, equipo) => sum + equipo.actividades.length,
    0
  )
  const totalComponentes = data.equipos.reduce(
    (sum, equipo) => sum + equipo.componentes.length,
    0
  )
  const duracion = Math.ceil(
    (new Date(data.fecha_fin).getTime() - new Date(data.fecha_inicio).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SISTEMA DE MANTENIMIENTOS SK TELECOM</Text>
          <Image 
            style={styles.logo} 
            src="/placeholder.svg"
          />
        </View>

        {/* Main Info */}
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Campo</Text>
              <Text style={styles.tableCell}>Valor</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>CODIGO MANTENIMIENTO</Text>
              <Text style={styles.tableCell}>{data.codigo_mantenimiento}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>FECHA INICIO</Text>
              <Text style={styles.tableCell}>{data.fecha_inicio}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>FECHA FIN</Text>
              <Text style={styles.tableCell}>{data.fecha_fin}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>TIPO</Text>
              <Text style={styles.tableCell}>{data.tipo}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>RESPONSABLE</Text>
              <Text style={styles.tableCell}>
                {data.nombre_responsable} {data.apellido_responsable}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            RESUMEN GENERAL
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text>Total de Equipos</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{totalEquipos}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text>Total de Actividades</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{totalActividades}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text>Total de Componentes</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{totalComponentes}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text>Duración</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{duracion} días</Text>
            </View>
          </View>
        </View>

        {/* Equipment Details */}
        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            DETALLE DE EQUIPOS
          </Text>
          {data.equipos.map((equipo, index) => (
            <View key={index} style={styles.equipmentSection}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                {equipo.Nombre_Producto}
              </Text>
              
              <Text style={{ marginTop: 5, fontWeight: 'bold' }}>Actividades:</Text>
              {equipo.actividades.map((actividad, idx) => (
                <Text key={idx}>• {actividad.nombre}</Text>
              ))}

              <Text style={{ marginTop: 5, fontWeight: 'bold' }}>Componentes:</Text>
              {equipo.componentes.map((componente, idx) => (
                <Text key={idx}>
                  • {componente.nombre} - Cantidad: {componente.cantidad}
                </Text>
              ))}

              {equipo.observacion && (
                <>
                  <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                    Observaciones:
                  </Text>
                  <Text>{equipo.observacion}</Text>
                </>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
