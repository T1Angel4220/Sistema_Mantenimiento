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
    // Obtener los datos directamente desde la solicitud
    $data = $request->all(); // Esto te dará los datos como un array

    $equiposComponentes = []; // Para almacenar los componentes creados

    // Guardar cada item del array en la tabla
    foreach ($data as $item) {
        // Crear una nueva instancia del modelo
        $equipoComponente = new EquipoComponente();

        $equipoComponente->equipo_mantenimiento_id = $item['equipo_mantenimiento_id']; // Asignar los valores a cada campo
        $equipoComponente->componente_id = $item['componente_id'];
        $equipoComponente->cantidad = 1; // La cantidad puede ser nula, si no existe se asigna null
        $equipoComponente->mantenimiento_id=$item['mantenimiento_id'];
        $equipoComponente->save(); // Guardar el registro

        $equiposComponentes[] = $equipoComponente; // Agregar el componente guardado al array
    }

    // Retornar la respuesta con los componentes creados
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
