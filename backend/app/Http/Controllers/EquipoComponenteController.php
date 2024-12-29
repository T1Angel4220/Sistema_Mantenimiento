<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EquipoComponente;

class EquipoComponenteController extends Controller
{
    /**
     * Obtener los componentes asignados a un equipo en un mantenimiento.
     */
    public function obtenerComponentesDeEquipo($equipoId)
{
    $equipo = Equipo::with('componentes')->find($equipoId);

    if (!$equipo) {
        return response()->json(['error' => 'Equipo no encontrado'], 404);
    }

}
    public function index()
    {
        $componentes = EquipoComponente::all();
            
        return response()->json($componentes);
    }

    /**
     * Agregar componentes a un equipo en un mantenimiento.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        '*.equipo_mantenimiento_id' => 'required|exists:equipo_mantenimiento,id',
        '*.componente_id' => 'required|exists:componentes,id',
        '*.cantidad' => 'nullable|integer|min:1', // cantidad opcional
    ]);

    $equiposComponentes = [];

    foreach ($validated as $item) {
        $equiposComponentes[] = EquipoComponente::create($item);
    }

    return response()->json($equiposComponentes, 201);
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
