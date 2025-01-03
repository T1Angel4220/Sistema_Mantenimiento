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

     public function create(Request $request)
     {
         // Obtener los datos directamente desde la solicitud
         $data = $request->all(); // Esto te dará los datos como un array
     
         $equiposComponentes = []; // Para almacenar los componentes creados
     
         // Guardar cada item del array en la tabla
         foreach ($data as $item) {
             // Validar los datos de entrada
             $validated = \Validator::make($item, [
                 'equipo_mantenimiento_id' => 'nullable|integer', // Opcional si no está relacionado con equipo
                 'componente_id' => 'required|exists:componentes,id',
                 'cantidad' => 'nullable|integer|min:1', // Asignar 1 si no está especificado
                 'mantenimiento_id' => 'required|integer|exists:mantenimientos,id',
             ])->validate();
     
             // Crear una nueva instancia del modelo
             $equipoComponente = new EquipoComponente();
     
             $equipoComponente->equipo_mantenimiento_id = $validated['equipo_mantenimiento_id'] ?? null; // Asignar si está presente
             $equipoComponente->componente_id = $validated['componente_id'];
             $equipoComponente->cantidad = $validated['cantidad'] ?? 1; // Si no existe, asignar 1 por defecto
             $equipoComponente->mantenimiento_id = $validated['mantenimiento_id'];
             $equipoComponente->save(); // Guardar el registro
     
             $equiposComponentes[] = $equipoComponente; // Agregar el componente guardado al array
         }
     
         // Retornar la respuesta con los componentes creados
         return response()->json($equiposComponentes, 201);

     }
 
    public function store(Request $request, $equipoMantenimientoId)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'componente_id' => 'required|exists:componentes,id',
            'cantidad' => 'required|integer|min:1',
            'mantenimiento_id' => 'required|integer',
        ]);
    
        // Crear una nueva instancia del modelo EquipoComponente
        $equipoComponente = new EquipoComponente();
        $equipoComponente->equipo_mantenimiento_id = $equipoMantenimientoId;
        $equipoComponente->componente_id = $validated['componente_id'];
        $equipoComponente->cantidad = $validated['cantidad'];
        $equipoComponente->mantenimiento_id = $validated['mantenimiento_id']; // Asignar mantenimiento_id
        $equipoComponente->save();
    
        // Recuperar información adicional del componente
        $componente = \App\Models\Componente::find($validated['componente_id']);
    
        return response()->json([
            'id' => $componente->id,
            'nombre' => $componente->nombre,
            'cantidad' => $equipoComponente->cantidad,
        ], 201);
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
    public function destroy($equipoMantenimientoId, $componenteId)
    {
        \Log::info('Intentando eliminar componente', [
            'equipoMantenimientoId' => $equipoMantenimientoId,
            'componenteId' => $componenteId,
        ]);
    
        $equipoComponente = EquipoComponente::where('equipo_mantenimiento_id', $equipoMantenimientoId)
            ->where('componente_id', $componenteId)
            ->first();
    
        if (!$equipoComponente) {
            \Log::error('Componente no encontrado', [
                'equipoMantenimientoId' => $equipoMantenimientoId,
                'componenteId' => $componenteId,
            ]);
            return response()->json(['error' => 'Componente no encontrado'], 404);
        }
    
        $equipoComponente->delete();
    
        \Log::info('Componente eliminado', ['id' => $componenteId]);
        return response()->json(['message' => 'Componente eliminado con éxito']);
    }
    
    
    
    
}
