<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EquipoComponente;

class EquipoComponenteController extends Controller
{
    /**
     * Obtener los componentes asignados a un equipo en un mantenimiento.
     */
    public function index($equipoMantenimientoId)
    {
        $componentes = EquipoComponente::with('componente')
            ->where('equipo_mantenimiento_id', $equipoMantenimientoId)
            ->get();

        return response()->json($componentes);
    }

    /**
     * Agregar componentes a un equipo en un mantenimiento.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipo_mantenimiento_id' => 'required|exists:equipo_mantenimiento,id',
            'componente_id' => 'required|exists:componentes,id',
            'cantidad' => 'required|integer|min:1',
        ]);

        $equipoComponente = EquipoComponente::create($validated);

        return response()->json($equipoComponente, 201);
    }

    /**
     * Actualizar un componente asignado a un equipo en un mantenimiento.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        $equipoComponente = EquipoComponente::findOrFail($id);
        $equipoComponente->update($validated);

        return response()->json($equipoComponente);
    }

    /**
     * Eliminar un componente de un equipo en un mantenimiento.
     */
    public function destroy($id)
    {
        $equipoComponente = EquipoComponente::findOrFail($id);
        $equipoComponente->delete();

        return response()->json(null, 204);
    }
}
