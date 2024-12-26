<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EquipoMantenimiento;
use App\Models\Mantenimiento;

class EquipoMantenimientoController extends Controller
{
    /**
     * Obtener todos los registros de la tabla equipo_mantenimiento.
     */
    public function index()
    {
        $registros = EquipoMantenimiento::with('mantenimiento', 'equipo')->get();
        return response()->json($registros);
    }

    /**
     * Crear un registro en la tabla equipo_mantenimiento.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mantenimiento_id' => 'required|exists:mantenimiento,id',
            'equipo_id' => 'required|exists:equipos,id',
        ]);

        $registro = EquipoMantenimiento::create($validated);
        return response()->json($registro, 201);
    }

    /**
     * Mostrar un registro específico de equipo_mantenimiento.
     */
    public function show($id)
    {
        $registro = EquipoMantenimiento::with('mantenimiento', 'equipo')->findOrFail($id);
        return response()->json($registro);
    }

    /**
     * Actualizar un registro en la tabla equipo_mantenimiento.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'mantenimiento_id' => 'required|exists:mantenimiento,id',
            'equipo_id' => 'required|exists:equipos,id',
        ]);

        $registro = EquipoMantenimiento::findOrFail($id);
        $registro->update($validated);
        return response()->json($registro);
    }

    /**
     * Eliminar un registro de la tabla equipo_mantenimiento.
     */
    public function destroy($id)
    {
        $registro = EquipoMantenimiento::findOrFail($id);
        $registro->delete();
        return response()->json(null, 204);
    }
}
