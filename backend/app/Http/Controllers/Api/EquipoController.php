<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipo;
use App\Models\ProcesoCompra;

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
        'fecha_fin' => 'required|date',
        'excluir_equipos' => 'array', // Validamos que sea un array opcional
    ]);

    $fechaInicio = $validated['fecha_inicio'];
    $fechaFin = $validated['fecha_fin'];
    $equiposAExcluir = $validated['excluir_equipos'] ?? []; // Tomamos los equipos a excluir o un array vacío

    // Equipos sin ningún mantenimiento
    $equiposSinMantenimiento = Equipo::whereDoesntHave('mantenimientos')
        ->whereNotIn('id', $equiposAExcluir) // Excluir los equipos indicados
        ->get();

    // Equipos con mantenimientos fuera del rango
    $equiposFueraRango = Equipo::whereHas('mantenimientos', function ($query) use ($fechaInicio, $fechaFin) {
        $query->where(function ($subQuery) use ($fechaInicio, $fechaFin) {
            $subQuery->where('fecha_inicio', '>', $fechaFin)
                     ->orWhere('fecha_fin', '<', $fechaInicio);
        });
    })
    ->whereNotIn('id', $equiposAExcluir) // Excluir los equipos indicados
    ->get();

    // Combinar los resultados en colecciones
    $equiposDisponibles = $equiposSinMantenimiento->merge($equiposFueraRango);

    return response()->json($equiposDisponibles);
}

public function equiposDisponiblesFiltros(Request $request)
{
    $validated = $request->validate([
        'fecha_inicio' => 'required|date',
        'fecha_fin' => 'required|date',
        'nombre_producto' => 'string|nullable', // Filtro opcional por nombre
        'tipo_equipo' => 'string|in:Informático,Electrónicos y Eléctricos,Industriales,Audiovisuales|nullable', // Opciones predefinidas
        'ubicacion_equipo' => 'string|in:Departamento de TI,Laboratorio de Redes,Sala de reuniones,Laboratorio CTT|nullable', // Opciones predefinidas
        'fecha_adquisicion_inicio' => 'date|nullable', // Inicio del rango de adquisición
        'fecha_adquisicion_fin' => 'date|nullable', // Fin del rango de adquisición
    ]);

    // 1. Consulta para los filtros de fechas de inicio y fin
    $queryFechas = Equipo::query()
        ->whereBetween('Fecha_Adquisicion', [
            $validated['fecha_inicio'],
            $validated['fecha_fin']
        ]);

    // 2. Consulta para los filtros generales (nombre, tipo, ubicación)
    $queryBase = Equipo::query();

    if (!empty($validated['nombre_producto'])) {
        $queryBase->where('Nombre_Producto', 'like', '%' . $validated['nombre_producto'] . '%');
    }

    if (!empty($validated['tipo_equipo'])) {
        $queryBase->where('Tipo_Equipo', $validated['tipo_equipo']);
    }

    if (!empty($validated['ubicacion_equipo'])) {
        $queryBase->where('Ubicacion_Equipo', $validated['ubicacion_equipo']);
    }

    // 3. Consulta para los filtros de adquisición (fecha inicio y fin)
    $queryAdquisicion = Equipo::query();

    if (!empty($validated['fecha_adquisicion_inicio']) && !empty($validated['fecha_adquisicion_fin'])) {
        $queryAdquisicion->whereBetween('Fecha_Adquisicion', [
            $validated['fecha_adquisicion_inicio'],
            $validated['fecha_adquisicion_fin']
        ]);
    }

    // Obtener resultados de las tres consultas
    $equiposPorFechas = $queryFechas->get();
    $equiposPorFiltrosGenerales = $queryBase->get();
    $equiposPorAdquisicion = $queryAdquisicion->get();

    // Intersecar las tres colecciones para obtener los resultados comunes
    $equiposDisponibles = $equiposPorFechas
        ->intersect($equiposPorFiltrosGenerales)
        ->intersect($equiposPorAdquisicion);

    return response()->json($equiposDisponibles);
}



public function store(Request $request)
{
    // Validar el request directamente
    $validatedData = $request->validate([
        'Nombre_Producto' => 'required|string|max:255',
        'Codigo_Barras' => 'required|string|max:100|unique:equipos,Codigo_Barras',
        'Tipo_Equipo' => 'required|string|in:Informático,Electrónicos y Eléctricos,Industriales,Audiovisuales',
        'Fecha_Adquisicion' => 'required|date',
        'Ubicacion_Equipo' => 'required|string|in:Departamento de TI,Laboratorio de Redes,Sala de reuniones,Laboratorio CTT',
        'Descripcion_Equipo' => 'nullable|string|max:500',
        'proceso_compra_id' => 'required|string|exists:procesos_compra,id',
    ]);

    // Verificar si el proceso de compra existe
    $procesoCompra = ProcesoCompra::findOrFail($validatedData['proceso_compra_id']);

    // Crear el equipo
    $equipo = Equipo::create($validatedData);

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
        $validatedData = $request->validate([
            'Nombre_Producto' => 'required|string|max:255',
            'Codigo_Barras' => 'required|string|max:100|unique:equipos,Codigo_Barras,' . $id,
            'Tipo_Equipo' => 'required|string|in:Informático,Electrónicos y Eléctricos,Industriales,Audiovisuales',
            'Fecha_Adquisicion' => 'required|date',
            'Ubicacion_Equipo' => 'required|string|in:Departamento de TI,Laboratorio de Redes,Sala de reuniones,Laboratorio CTT',
            'Descripcion_Equipo' => 'nullable|string|max:500',
            'proceso_compra_id' => 'required|string|exists:procesos_compra,id',
        ]);

        // Encuentra el equipo por su ID
        $equipo = Equipo::findOrFail($id);

        // Actualiza los campos
        $equipo->update($validatedData);

        // Retorna el equipo actualizado
        return response()->json(['success' => true, 'equipo' => $equipo], 200);
    }

    public function destroy(string $id)
    {
        $equipo = Equipo::destroy($id);
        return $equipo;
    }
}
