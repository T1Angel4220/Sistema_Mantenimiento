<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mantenimiento;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    public function generarReporte(Request $request)
    {
        $query = Mantenimiento::query();

        // Aplicar filtros
        if ($request->fechaInicio && $request->fechaFin) {
            $query->whereBetween('fecha', [
                Carbon::parse($request->fechaInicio)->startOfDay(),
                Carbon::parse($request->fechaFin)->endOfDay()
            ]);
        }

        if ($request->tipoMantenimiento) {
            $query->where('tipo', $request->tipoMantenimiento);
        }

        if ($request->proveedor) {
            $query->where('proveedor_id', $request->proveedor);
        }

        if ($request->componente) {
            $query->where('componente_id', $request->componente);
        }

        if ($request->equipo) {
            $query->where('equipo_id', $request->equipo);
        }

        // Agrupar por mes y contar mantenimientos
        $resultados = $query
            ->select(
                DB::raw('DATE_FORMAT(fecha, "%Y-%m") as mes'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('mes')
            ->orderBy('mes')
            ->get()
            ->map(function ($item) {
                // Formatear el nombre del mes para mostrar
                $fecha = Carbon::createFromFormat('Y-m', $item->mes);
                return [
                    'mes' => $fecha->formatLocalized('%B %Y'),
                    'total' => $item->total
                ];
            });

        return response()->json($resultados);
    }
}