import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function MaintenanceTable({ resultados, onRowDoubleClick }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resultados.map((resultado) => (
          <TableRow 
            key={resultado.id}
            onDoubleClick={() => onRowDoubleClick(resultado.id)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>{resultado.id}</TableCell>
            <TableCell>{resultado.codigo_mantenimiento}</TableCell>
            <TableCell>{resultado.tipo}</TableCell>
            <TableCell>{resultado.fecha_inicio}</TableCell>
            <TableCell>{resultado.fecha_fin}</TableCell>
            <TableCell>{resultado.estado}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

