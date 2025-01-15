import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MaintenanceDetailsModal({ isOpen, onClose, maintenanceId }) {
  const [maintenance, setMaintenance] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch maintenance details when modal opens
  const fetchMaintenanceDetails = async () => {
    if (!maintenanceId) return
    
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/mantenimientoDetalles/${maintenanceId}`)
      const data = await response.json()
      setMaintenance(data)
    } catch (error) {
      console.error('Error fetching maintenance details:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && maintenanceId) {
      fetchMaintenanceDetails()
    }
  }, [isOpen, maintenanceId])

  if (!maintenance || loading) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Hoja de Vida del Reporte</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="equipos">Equipos y Actividades</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold">Código de Mantenimiento:</p>
                  <p className="text-sm">{maintenance.codigo_mantenimiento}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Tipo de Mantenimiento:</p>
                  <p className="text-sm">{maintenance.tipo}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Fecha:</p>
                  <p className="text-sm">{`${maintenance.fecha_inicio} - ${maintenance.fecha_fin}`}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Estado:</p>
                  <p className="text-sm">{maintenance.estado}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Proveedor:</p>
                  <p className="text-sm">{maintenance.proveedor || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Contacto Proveedor:</p>
                  <p className="text-sm">{maintenance.contacto_proveedor || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Costo:</p>
                  <p className="text-sm">${maintenance.costo || '0'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipos">
            <ScrollArea className="h-[60vh]">
              {maintenance.equipos?.map((equipo) => (
                <Card key={equipo.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{equipo.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Información del Equipo</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>Tipo: {equipo.tipo}</p>
                          <p>Tipo de Activo: {equipo.tipo_activo}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Actividades</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {equipo.actividades?.map((actividad) => (
                            <li key={actividad.id}>{actividad.nombre}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Componentes</h4>
                        <ul className="list-disc pl-5 text-sm space-y-2">
                          {equipo.componentes?.map((componente) => (
                            <li key={componente.id}>
                              <div className="font-medium">{componente.nombre}</div>
                              <div className="text-muted-foreground">Cantidad: {componente.cantidad}</div>
                              {componente.descripcion && (
                                <p className="text-sm text-muted-foreground mt-1">{componente.descripcion}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {equipo.observacion && (
                        <div>
                          <h4 className="font-semibold mb-2">Observaciones</h4>
                          <p className="text-sm text-muted-foreground">{equipo.observacion}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

