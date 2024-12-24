<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipo;

class EquipoController extends Controller
{

    public function index()
    {
        $equipos = Equipo::all();
        return $equipos;
    }
    public function obtenerEquiposDisponibles(Request $request)
    {
        
        $validated = $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);
    
        $fechaInicio = $validated['fecha_inicio'];
        $fechaFin = $validated['fecha_fin'];
    
        // Activos sin ningún mantenimiento
        $activosSinMantenimiento = Activo::whereDoesntHave('mantenimientos')->pluck('id');
    
        // Activos con mantenimientos fuera del rango
        $activosFueraRango = Activo::whereHas('mantenimientos', function ($query) use ($fechaInicio, $fechaFin) {
            $query->where(function ($subQuery) use ($fechaInicio, $fechaFin) {
                $subQuery->where('fecha_inicio', '>', $fechaFin)
                         ->orWhere('fecha_fin', '<', $fechaInicio);
            });
        })->pluck('id');
    
        // Combinar los IDs de ambos conjuntos
        $activosDisponiblesIds = $activosSinMantenimiento->merge($activosFueraRango)->unique();
    
        // Recuperar los registros completos de los activos disponibles
        $activosDisponibles = Activo::whereIn('id', $activosDisponiblesIds)->get();
    
        return response()->json($activosDisponibles);
    }
 
 public function store(Request $request)
{
    // Validar el request directamente
    $request->validate([
        'Nombre_Producto' => 'required|string|max:255',
        'Codigo_Barras'=>'required|string|max:100',
        'Tipo_Equipo' => 'required|string|in:Informático,Electrónicos y Eléctricos,Industriales,Audiovisuales',
        'Fecha_Adquisicion' => 'required|date',
        'Ubicacion_Equipo' => 'required|string|in:Departamento de TI,Laboratorio de Redes,Sala de reuniones,Laboratorio CTT',
        'Descripcion_Equipo' => 'nullable|string|max:500',
    ]);

    // Usar directamente el request para asignar datos
    $equipo = new Equipo();
    $equipo->Nombre_Producto = $request->Nombre_Producto;
    $equipo->Codigo_Barras=$request->Codigo_Barras;
    $equipo->Tipo_Equipo = $request->Tipo_Equipo;
    $equipo->Fecha_Adquisicion = $request->Fecha_Adquisicion;
    $equipo->Ubicacion_Equipo = $request->Ubicacion_Equipo;
    $equipo->Descripcion_Equipo = $request->Descripcion_Equipo;
    $equipo->save();

    return response()->json(['success' => true, 'equipo' => $equipo], 201);
}


 
    public function show(string $id)
    {
        $equipo = Equipo::find($id);
        return $equipo;
    }


    public function update(Request $request, string $id)
    {
        // Validar los datos enviados en el request
        $request->validate([
            'Nombre_Producto' => 'required|string|max:255',
            'Tipo_Equipo' => 'required|string|in:Informático,Electrónicos y Eléctricos,Industriales,Audiovisuales',
            'Fecha_Adquisicion' => 'required|date',
            'Ubicacion_Equipo' => 'required|string|in:Departamento de TI,Laboratorio de Redes,Sala de reuniones,Laboratorio CTT',
            'Descripcion_Equipo' => 'nullable|string|max:500',
        ]);
    
        // Encuentra el equipo por su ID
        $equipo = Equipo::findOrFail($id);
    
        // Actualiza los campos
        $equipo->Nombre_Producto = $request->Nombre_Producto;
        $equipo->Tipo_Equipo = $request->Tipo_Equipo;
        $equipo->Fecha_Adquisicion = $request->Fecha_Adquisicion;
        $equipo->Ubicacion_Equipo = $request->Ubicacion_Equipo;
        $equipo->Descripcion_Equipo = $request->Descripcion_Equipo;
    
        // Guarda los cambios
        $equipo->save();
    
        // Retorna el equipo actualizado
        return response()->json(['success' => true, 'equipo' => $equipo], 200);
    }
    

    public function destroy(string $id)
    {
        $equipo = Equipo::destroy($id);
        return $equipo;
    }
}
